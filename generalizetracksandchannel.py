from collections import defaultdict
from mido import MidiFile
from testmidi import *
from mido import MidiFile

start = time.time()

def identify_melody_track(midi_file):
    melody_track = None
    highest_score = 0

    for i, track in enumerate(midi_file.tracks):
        note_count = 0
        pitch_range = set()
        total_velocity = 0
        event_count = 0
        
        for msg in track:
            if msg.type == 'note_on' and msg.channel == 0 and msg.velocity > 0:
                return track
            elif msg.type == 'note_on' and msg.channel != 9 and msg.velocity > 0:
                note_count += 1
                pitch_range.add(msg.note)
                total_velocity += msg.velocity
                event_count += 1

        if note_count > 0:
            pitch_span = max(pitch_range) - min(pitch_range) if pitch_range else 0
            avg_velocity = total_velocity / event_count if event_count > 0 else 0
            
            # Weighted scoring system
            score = (note_count * 0.5) + (pitch_span * 0.3) + (avg_velocity * 0.2)

            if score > highest_score:
                highest_score = score
                melody_track = track

    return melody_track

def identify_main_channel(melody_track):
    channel_data = defaultdict(lambda: {"note_count": 0, "pitch_range": set(), "total_velocity": 0})

    for msg in melody_track:
        if msg.type == 'note_on' and msg.velocity > 0:
            channel = msg.channel
            channel_data[channel]["note_count"] += 1
            channel_data[channel]["pitch_range"].add(msg.note)
            channel_data[channel]["total_velocity"] += msg.velocity

    # Calculate scores for each channel
    best_channel = None
    highest_score = 0

    for channel, data in channel_data.items():
        if channel == 9:  # Skip drum channel
            continue

        note_count = data["note_count"]
        pitch_span = max(data["pitch_range"]) - min(data["pitch_range"]) if data["pitch_range"] else 0
        avg_velocity = data["total_velocity"] / note_count if note_count > 0 else 0

        # Weighted scoring system
        score = (note_count * 0.5) + (pitch_span * 0.3) + (avg_velocity * 0.2)

        if score > highest_score:
            highest_score = score
            best_channel = channel

    return best_channel

# Path ke direktori dataset
dataset_path = "midi_dataset2/Backstreet_Boys"
midi_files = [f for f in os.listdir(dataset_path) if f.endswith('.mid') and f.count(".")==1]
# print(len(midi_files))
# print(midi_files)
# midi_files = ["Larger_Than_Life.mid"]
all_vect_hist = []
# Loop melalui semua file MIDI
for midi_file in midi_files:
    midi_path = os.path.join(dataset_path, midi_file)
    # print(MidiFile(midi_path))
    midi = MidiFile(midi_path)
    # print(midi)
    melody_track = identify_melody_track(midi)
    main_channel = identify_main_channel(melody_track)
    # print("Melody_track: ", melody_track)
    print("Main_channel: ", main_channel)
    midi_beat = midi_to_beats(midi_path, melody_track, main_channel)
    # print(midi_beat)
    midi_window = beats_to_windows(midi_beat, 20)
    print("banyak window:", len(midi_window))
    # midi_note = midi_to_note(midi_path)
    count = 0
    for window in midi_window:
        count = count + 1
        flattened_window = [note for beat in window for note in beat]
        if(len(flattened_window)!=0):
            hist_atb = calculate_atb(flattened_window)
            hist_rtb = calculate_rtb(flattened_window)
            hist_ftb = calculate_ftb(flattened_window)
            all_vect_hist.append({
                "filename": midi_file,
                "hist_ATB": hist_atb,
                "hist_RTB": hist_rtb,
                "hist_FTB": hist_ftb
            })


# Load MIDI file and identify the melody track
query_path = "midi_dataset2/Backstreet_Boys/I_Want_It_That_Way.mid"
query_midi = MidiFile(query_path)
# print(query_midi)
melody_track = identify_melody_track(query_midi)
main_channel = identify_main_channel(melody_track)

query_beats = midi_to_beats(query_path, melody_track, main_channel)
query_windows = beats_to_windows(query_beats, 20)
similarity_result = [0 for i in range(len(midi_files)+1)]
temp_song = all_vect_hist[0]["filename"]

count = 0
for window in query_windows:
    flattened_window = [note for beat in window for note in beat]
    if(len(flattened_window)!=0):
        hist_atb = calculate_atb(flattened_window)
        hist_rtb = calculate_rtb(flattened_window)
        hist_ftb = calculate_ftb(flattened_window)
        all_hist = {"hist_ATB": hist_atb,
                "hist_RTB": hist_rtb,
                "hist_FTB": hist_ftb}
        i = 0
        count2 = 0
        for database_window in all_vect_hist:
            if database_window["filename"] != temp_song:
                temp_song = database_window["filename"]
                i += 1
                count2 += 1
            count2 += 1
            # print("simres:" , similarity_result[i])
            similarity_result[i] = max(similarity_result[i], calculate_similarity_score(database_window, all_hist))
            # similarity_result.append({
            #     "score": calculate_similarity_score(database_window, all_hist),
            #     "filename": database_window["filename"]
            # })
    else:
        count += 1
concat_sim_result = []
for i in range(len(midi_files)):
    concat_sim_result.append({
        "filename": midi_files[i],
        "score": similarity_result[i]
    })
concat_sim_result.sort(key=lambda x: x["score"], reverse=True)
for i in range(5):
    print(concat_sim_result[i]["filename"], concat_sim_result[i]["score"])
print(len(concat_sim_result))
print(concat_sim_result)
end = time.time()

print("Time run: ", end - start)    