import numpy as np
from pretty_midi import PrettyMIDI
import os
import time
# Function to group notes by beat
def group_notes_by_beat(midi_data):
    # midi = PrettyMIDI(midi_file)
    beats = midi_data.get_beats()
    # Prepare a dictionary to hold beats and their notes
    beat_notes = {i: [] for i in range(len(beats))}
    
    # Iterate over instruments and notes
    for instrument in midi_data.instruments:
        if not instrument.is_drum:
            for note in instrument.notes:
                # Find the beat index for the note's start time
                beat_index_first = np.searchsorted(beats, note.start) - 1
                beat_index_last = np.searchsorted(beats, note.end) - 1
                # Ensure the beat index is valid
                for i in range(beat_index_first, beat_index_last+1):
                    if 0 <= i < len(beats):
                        beat_notes[i].append(note.pitch)
    return beat_notes, len(beats)

def group_beat_by_window(midi_data):
    beat_notes, len_beats = group_notes_by_beat(midi_data)
    # Define window size and step
    window_size = 20
    step = 4
    list_window = []
    window_notes = []
    # Create windows

    # Populate the initial window
    for i in range(window_size):
        if i in beat_notes:
            window_notes.extend(beat_notes[i])
    list_window.append(window_notes[:])  # Add a copy of the initial window

    # Slide the window
    for start in range(step, len_beats - window_size + 1, step):
        # Remove the beats that slide out
        for i in range(start - step, start):
            if i in beat_notes:
                window_notes = window_notes[len(beat_notes[i]):]

        # Add the new beats that slide in
        for i in range(start + window_size - step, start + window_size):
            if i in beat_notes:
                window_notes.extend(beat_notes[i])

        # Append the current window to the result
        list_window.append(window_notes[:])  # Add a copy of the window
        
    return list_window

def calculate_atb(melody):
    histogram, _ = np.histogram(melody, bins=np.arange(0, 128))
    return histogram / sum(histogram)  # Normalisasi histogram

def calculate_rtb(melody):
    relative_melody = np.diff(melody)
    histogram, _ = np.histogram(relative_melody, bins=np.arange(-127, 128))
    return histogram / sum(histogram)  # Normalisasi histogram

def calculate_ftb(melody):
    for i in range(len(melody)):
        melody[i] -= melody[0]
    histogram, _ = np.histogram(melody, bins=np.arange(-127, 128))
    return histogram / sum(histogram)  # Normalisasi histogram
    
def cosine_similarity(hist_a, hist_b):
    dot_product = np.dot(hist_a, hist_b)
    magnitude1 = np.linalg.norm(hist_a)
    magnitude2 = np.linalg.norm(hist_b)
    return dot_product / (magnitude1 * magnitude2) if magnitude1 > 0 and magnitude2 > 0 else 0

def calculate_similarity_score(all_hist, query_hist):
    return 0.2 * cosine_similarity(all_hist[0], query_hist[0]) + 0.6 * cosine_similarity(all_hist[1], query_hist[1]) + 0.2 * cosine_similarity(all_hist[2], query_hist[2])

def sliding_similarity(windows_a, windows_b):
    if len(windows_a) > len(windows_b):
        windows_a, windows_b = windows_b, windows_a  # Ensure A is shorter
    
    max_score = 0
    len_a, len_b = len(windows_a), len(windows_b)
    
    # Slide A over B
    for shift in range(len_b - len_a + 1):
        score = 0
        for i in range(len_a):
            # Compute similarity for aligned windows
            score += calculate_similarity_score(windows_a[i], windows_b[shift + i])
        avg_score = score / len_a
        max_score = max(max_score, avg_score)
    
    return max_score

start = time.time()
def preprocess_database(dataset_path):
    # # Collect MIDI files from the selected folders
    midi_files = []

    midi_files = [
        os.path.join(dataset_path, file).replace("\\", "/")
        for file in os.listdir(dataset_path)
        if file.lower().endswith('.mid')
    ]

    all_vect_hist = {}
    # Loop melalui semua file MIDI
    for midi_file in midi_files:
        try:
            midi_data = PrettyMIDI(midi_file)
            # Process MIDI data
        except:
            continue

        midi_window = group_beat_by_window(midi_data)
        all_vect_hist[midi_file] = []
        for window in midi_window:
            if(len(window)!=0):
                hist_atb = calculate_atb(window)
                hist_rtb = calculate_rtb(window)
                hist_ftb = calculate_ftb(window)
                all_vect_hist[midi_file].append([hist_atb,hist_rtb,hist_ftb])
    return all_vect_hist

def process_query(query_path, database):
    try:
        query_data = PrettyMIDI(query_path)
        progress = 10
        yield progress
        # Process MIDI data
        query_windows = group_beat_by_window(query_data)

        final_res = []
        database[query_path] = []
        # extract query features
        for window in query_windows:
            if(len(window)!=0):
                hist_atb = calculate_atb(window)
                hist_rtb = calculate_rtb(window)
                hist_ftb = calculate_ftb(window)
                database[query_path].append([hist_atb,hist_rtb,hist_ftb])
            progress += 20/len(query_windows)
            yield progress

        # compare query to database
        for midi_file in database.keys():
            if(midi_file == query_path):
                continue
            similarity_result = sliding_similarity(database[midi_file], database[query_path])
            if(similarity_result >= 0.7000000):
                final_res.append({
                    "score": similarity_result,
                    "filename": midi_file
                })
            progress += 70/len(database.keys())
            yield progress
        final_res.sort(key=lambda x: x["score"], reverse=True)
        return final_res
    
    except:
        return []
    
    


