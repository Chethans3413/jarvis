const btn = document.querySelector('.talk');
const content = document.querySelector('.content');

function speak(text) {
    const text_speak = new SpeechSynthesisUtterance(text);

    text_speak.rate = 1;
    text_speak.volume = 1;
    text_speak.pitch = 1;

    window.speechSynthesis.speak(text_speak);
}

function wishMe() {
    var day = new Date();
    var hour = day.getHours();

    if (hour >= 0 && hour < 12) {
        speak("Good Morning Boss...");
    } else if (hour >= 12 && hour < 17) {
        speak("Good Afternoon Master...");
    } else {
        speak("Good Evening Sir...");
    }
}

window.addEventListener('load', () => {
    speak("Initializing JARVIS...");
    wishMe();
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
    const currentIndex = event.resultIndex;
    const transcript = event.results[currentIndex][0].transcript;
    content.textContent = transcript;
    takeCommand(transcript.toLowerCase());
};

btn.addEventListener('click', () => {
    content.textContent = "Listening...";
    recognition.start();
});

function takeCommand(message) {
    if (message.includes('hey') || message.includes('hello')) {
        speak("Hello Sir, How May I Help You?");
    } else if (message.includes("open google")) {
        window.open("https://google.com", "_blank");
        speak("Opening Google...");
    } else if (message.includes("open youtube")) {
        window.open("https://youtube.com", "_blank");
        speak("Opening Youtube...");
    } else if (message.includes("open facebook")) {
        window.open("https://facebook.com", "_blank");
        speak("Opening Facebook...");
    } else if (message.includes('what is') || message.includes('who is') || message.includes('what are')) {
        window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
        const finalText = "This is what I found on the internet regarding " + message;
        speak(finalText);
    } else if (message.includes('wikipedia')) {
        window.open(`https://en.wikipedia.org/wiki/${message.replace("wikipedia", "").trim()}`, "_blank");
        const finalText = "This is what I found on Wikipedia regarding " + message;
        speak(finalText);
    } else if (message.includes('time')) {
        const time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
        const finalText = "The current time is " + time;
        speak(finalText);
    } else if (message.includes('date')) {
        const date = new Date().toLocaleString(undefined, { month: "short", day: "numeric" });
        const finalText = "Today's date is " + date;
        speak(finalText);
    } else if (message.includes('calculator')) {
        window.open('Calculator:///');
        const finalText = "Opening Calculator";
        speak(finalText);
    } else if (message.includes('weather')) {
        const location = message.replace('weather', '').trim() || 'current location';
        window.open(`https://www.google.com/search?q=weather+${location.replace(" ", "+")}`, "_blank");
        speak(`Showing weather information for ${location}`);
    } else if (message.includes('set reminder') || message.includes('remind me')) {
        const reminderText = message.replace('set reminder', '').replace('remind me', '').trim();
        const reminder = {
            text: reminderText,
            timestamp: new Date().getTime()
        };
        localStorage.setItem(`reminder_${reminder.timestamp}`, JSON.stringify(reminder));
        speak(`I've set a reminder: ${reminderText}`);
    } else if (message.includes('show reminders')) {
        let reminders = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('reminder_')) {
                reminders.push(JSON.parse(localStorage.getItem(key)));
            }
        }
        if (reminders.length > 0) {
            speak("Here are your reminders: " + reminders.map(r => r.text).join(', '));
        } else {
            speak("You have no reminders set.");
        }
    } else if (message.includes('play music') || message.includes('play song')) {
        const song = message.replace('play music', '').replace('play song', '').trim();
        window.open(`https://www.youtube.com/results?search_query=${song.replace(" ", "+")}`, "_blank");
        speak(`Playing ${song} on YouTube`);
    } else if (message.includes('directions to')) {
        const destination = message.replace('directions to', '').trim();
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination.replace(" ", "+")}`, "_blank");
        speak(`Getting directions to ${destination}`);
    } else if (message.includes('calendar')) {
        window.open('https://calendar.google.com', '_blank');
        speak("Opening your calendar");
    } else if (message.includes('make a note') || message.includes('take a note')) {
        const noteText = message.replace('make a note', '').replace('take a note', '').trim();
        const note = {
            text: noteText,
            timestamp: new Date().getTime()
        };
        localStorage.setItem(`note_${note.timestamp}`, JSON.stringify(note));
        speak(`I've made a note: ${noteText}`);
    } else if (message.includes('show notes')) {
        let notes = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('note_')) {
                notes.push(JSON.parse(localStorage.getItem(key)));
            }
        }
        if (notes.length > 0) {
            speak("Here are your notes: " + notes.map(n => n.text).join(', '));
        } else {
            speak("You have no notes saved.");
        }
    } else if (message.includes('translate')) {
        const text = message.replace('translate', '').trim();
        window.open(`https://translate.google.com/?text=${text.replace(" ", "+")}`, "_blank");
        speak("Opening Google Translate");
    } else {
        window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
        const finalText = "I found some information for " + message + " on Google";
        speak(finalText);
    }
}