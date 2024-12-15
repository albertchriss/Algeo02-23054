import numpy as np
from pretty_midi import PrettyMIDI
import os
import time
from scipy.spatial.distance import cosine
import mido
# Function to group notes by beat
def group_notes_by_beat(midi_file):
    midi = PrettyMIDI(midi_file)
    beats = midi.get_beats()
    # Prepare a dictionary to hold beats and their notes
    beat_notes = {i: [] for i in range(len(beats))}
    # count = 0
    # Iterate over instruments and notes
    for instrument in midi.instruments:
        if not instrument.is_drum:
            for note in instrument.notes:
                # count += 1
                # Find the beat index for the note's start time
                beat_index_first = np.searchsorted(beats, note.start) - 1
                beat_index_last = np.searchsorted(beats, note.end) - 1
                # Ensure the beat index is valid
                for i in range(beat_index_first, beat_index_last+1):
                    if 0 <= i < len(beats):
                        beat_notes[i].append(note.pitch)
    return beat_notes, len(beats)

def group_beat_by_window(midi_file):
    beat_notes, len_beats = group_notes_by_beat(midi_file)
    # Define window size and step
    window_size = 20
    step = 4
    list_window = []
    window_notes = []
    # Create windows
    # for start in range(0, len_beats - window_size + 1, step):
    #     end = start + window_size
    #     window_notes = []
    #     for i in range(start, end):
    #         if i in beat_notes:
    #             window_notes.extend(beat_notes[i])
    #     list_window.append(window_notes)

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
    similarity = 1 - cosine(hist_a, hist_b)
    return similarity

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

# Example usage
# midi_path = "midi_dataset2/Backstreet_Boys/I_Want_It_That_Way.mid"
# grouped_notes = group_notes_by_beat(midi_path)
# for beat, notes in grouped_notes.items():
#     print(f"Beat {beat}: {notes}")
# group_beat_by_window(midi_path)

start = time.time()

# Path ke direktori dataset
dataset_path = "midi_dataset2"
# midi_files = [f for f in os.listdir(dataset_path) if f.endswith('.mid') and f.count(".")==1]
# midi_files = ["I_Want_It_That_Way.mid"]

# List all folders inside dataset_path
all_folders = [f for f in os.listdir(dataset_path) if os.path.isdir(os.path.join(dataset_path, f))]
# selected_folders = all_folders[:10]  # Select the first 10 folders

# Collect MIDI files from the selected folders
midi_files = []

for folder in all_folders:
    folder_path = os.path.join(dataset_path, folder)
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if file.endswith('.mid') and file.count('.') == 1:
                # Use os.path.join(root, file) directly
                midi_files.append(os.path.join(root, file))

midi_files = midi_files[:1000]
all_vect_hist = {}
# Loop melalui semua file MIDI
for midi_file in midi_files:
    try:
        midi_data = PrettyMIDI(midi_file)
        # Process MIDI data
    except (OSError,ValueError,EOFError,KeyError,TypeError,AttributeError,UnicodeDecodeError,IndexError,mido.midifiles.meta.KeySignatureError) as e:
        print(f"Error processing {midi_file}: {e}")
        continue

    # midi_path = os.path.join(dataset_path, midi_file)
    midi_path = midi_file
    midi_window = group_beat_by_window(midi_path)
    all_vect_hist[midi_file] = []
    # print("Banyak window:", len(midi_window))
    for window in midi_window:
        if(len(window)!=0):
            hist_atb = calculate_atb(window)
            hist_rtb = calculate_rtb(window)
            hist_ftb = calculate_ftb(window)
            all_vect_hist[midi_file].append([hist_atb,hist_rtb,hist_ftb])

query_path = "midi_dataset2/Backstreet_Boys/bboys2.mid"
query_windows = group_beat_by_window(query_path)
final_res = []
all_vect_hist[query_path] = []
end = time.time()

print("Time run for preprocess database: ", end - start) 

start = time.time()
for window in query_windows:
    if(len(window)!=0):
        hist_atb = calculate_atb(window)
        hist_rtb = calculate_rtb(window)
        hist_ftb = calculate_ftb(window)
        all_vect_hist[query_path].append([hist_atb,hist_rtb,hist_ftb])
end = time.time()

print("Time run for processing query: ", end - start) 

start = time.time()
for midi_file in midi_files:
    try:
        midi_data = PrettyMIDI(midi_file)
        # Process MIDI data
    except (OSError,ValueError,EOFError,KeyError,TypeError,AttributeError,UnicodeDecodeError,IndexError,mido.midifiles.meta.KeySignatureError) as e:
        print(f"Error processing {midi_file}: {e}")
        continue
    # similarity_result = 0
    # for window in query_windows:
    #     if(len(window)!=0):
    #         hist_atb = calculate_atb(window)
    #         hist_rtb = calculate_rtb(window)
    #         hist_ftb = calculate_ftb(window)
    #         all_hist = [hist_atb,hist_rtb,hist_ftb]

    #         for i in range(len(all_vect_hist[midi_file])):
    #             similarity_result +=  calculate_similarity_score(all_vect_hist[midi_file][i], all_hist)

    # similarity_result /= (len(all_vect_hist[midi_file])*len(query_windows))
    final_res.append({
        # "score": similarity_result,
        "score": sliding_similarity(all_vect_hist[midi_file], all_vect_hist[query_path]),
        "filename": midi_file
    })
end = time.time()

final_res.sort(key=lambda x: x["score"], reverse=True)
print("Time run for comparing query with all database: ", end - start) 
# for i in range(5):
#     print(similarity_result[i]["filename"], similarity_result[i]["score"])
# print(final_res)/
for i in range(20):
    print(final_res[i])
print(f"Total midi file: {len(final_res)}")

# end = time.time()

# print("Time run: ", end - start)    
