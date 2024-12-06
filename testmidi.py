from mido import MidiFile
import os
import numpy as np
import time
from scipy.spatial.distance import cosine

def midi_to_note(filename):
    midi = MidiFile(filename)
    midi_note = []
    for msg in midi.tracks[1]:  # assuming melody is in the first track
        if msg.type == "note_on" and msg.channel == 0 and msg.velocity > 0:
            midi_note.append(msg.note)
    
    return midi_note

def midi_to_beats(filename, melody_track, main_channel):
    midi = MidiFile(filename)
    ticks_per_beat = midi.ticks_per_beat
    # Collect note events by beat
    current_time = 0
    beat_events = []
    current_beat = []
    current_position = 0

    for msg in melody_track:  # assuming melody is in the first track
        current_time += msg.time
        beat_position = current_time / ticks_per_beat # Conversion factor: ticks to beats

        if msg.type == "note_on" and msg.channel == main_channel and msg.velocity > 0:
            
            if len(current_beat) == 0:
                current_beat.append(msg.note)
                current_position = beat_position
            elif beat_position == current_position:
                current_beat.append(msg.note)
            else:
                beat_events.append(current_beat)
                current_beat = [msg.note]
                current_position = beat_position

    return beat_events

def beats_to_windows(beat_events, window_size): 
    sliding_window = 4
    windows = []
    for i in range((len(beat_events) - window_size)//sliding_window):
        windows.append(beat_events[i*sliding_window:i*sliding_window+window_size])
    windows.append(beat_events[len(beat_events)-window_size:]) # potongan terakhir yang mungkin tidak terambil
    return windows

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
    return 0.4 * cosine_similarity(all_hist["hist_ATB"], query_hist["hist_ATB"]) + 0.4 * cosine_similarity(all_hist["hist_RTB"], query_hist["hist_RTB"]) + 0.2 * cosine_similarity(all_hist["hist_FTB"], query_hist["hist_FTB"])
# # Example usage
# beat_list = midi_to_beats("MIDI_sample.mid") # list of beats
# window_list = beats_to_windows(beat_list, 20) # list of windows dengan ukuran 20 beats

# start = time.time()

# # Path ke direktori dataset
# dataset_path = "midi_dataset2/Backstreet_Boys"
# # midi_files = [f for f in os.listdir(dataset_path) if f.endswith('.mid') and f.count(".")==1]
# # print(midi_files)
# midi_files = ["I_Want_It_That_Way.mid", "Larger_Than_Life.mid"]
# all_vect_hist = []
# # Loop melalui semua file MIDI
# for midi_file in midi_files:
#     midi_path = os.path.join(dataset_path, midi_file)
#     print(MidiFile(midi_path))
#     midi_beat = midi_to_beats(midi_path)
#     print(midi_beat)
#     midi_window = beats_to_windows(midi_beat, 20)
#     # midi_note = midi_to_note(midi_path)
#     count = 0
#     for window in midi_window:
#         count = count + 1
#         flattened_window = [note for beat in window for note in beat]
#         if(len(flattened_window)!=0):
#             hist_atb = calculate_atb(flattened_window)
#             hist_rtb = calculate_rtb(flattened_window)
#             hist_ftb = calculate_ftb(flattened_window)
#             all_vect_hist.append({
#                 "filename": midi_file,
#                 "hist_ATB": hist_atb,
#                 "hist_RTB": hist_rtb,
#                 "hist_FTB": hist_ftb
#             })
# query_path = "midi_dataset2/Backstreet_Boys/I_Want_It_That_Way.mid"
# query_midi = MidiFile(query_path)
# # print(query_midi)
# query_beats = midi_to_beats(query_path)
# query_windows = beats_to_windows(query_beats, 20)
# similarity_result = []
# for window in query_windows:
#     flattened_window = [note for beat in window for note in beat]
#     if(len(flattened_window)!=0):
#         hist_atb = calculate_atb(flattened_window)
#         hist_rtb = calculate_rtb(flattened_window)
#         hist_ftb = calculate_ftb(flattened_window)
#         all_hist = {"hist_ATB": hist_atb,
#                 "hist_RTB": hist_rtb,
#                 "hist_FTB": hist_ftb}
#         for database_window in all_vect_hist:
#             similarity_result.append({
#                 "score": calculate_similarity_score(database_window, all_hist),
#                 "filename": database_window["filename"]
#             })

# similarity_result.sort(key=lambda x: x["score"], reverse=True)
# # for i in range(5):
# #     print(similarity_result[i]["filename"], similarity_result[i]["score"])
# print(similarity_result)
# end = time.time()

# print("Time run: ", end - start)    