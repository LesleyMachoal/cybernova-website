import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '../../data');
const eventsFile = path.join(dataDir, 'events.json');

const ensureDataDir = () => {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

const readEvents = () => {
  ensureDataDir();
  if (!fs.existsSync(eventsFile)) {
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(eventsFile, 'utf-8')) || [];
  } catch {
    return [];
  }
};

const writeEvents = (events) => {
  ensureDataDir();
  fs.writeFileSync(eventsFile, JSON.stringify(events, null, 2));
};

export const EventModel = {
  getEvents: async () => readEvents(),

  createEvent: async (eventData) => {
    const events = readEvents();
    const newEvent = {
      id: Date.now().toString(),
      ...eventData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    events.unshift(newEvent);
    writeEvents(events);
    return newEvent;
  },

  updateEvent: async (id, eventData) => {
    const events = readEvents();
    const index = events.findIndex((e) => String(e.id) === String(id));
    if (index === -1) return null;
    
    events[index] = {
      ...events[index],
      ...eventData,
      id: events[index].id,
      created_at: events[index].created_at,
      updated_at: new Date().toISOString(),
    };
    writeEvents(events);
    return events[index];
  },

  deleteEvent: async (id) => {
    const events = readEvents();
    const filtered = events.filter((e) => String(e.id) !== String(id));
    writeEvents(filtered);
    return true;
  },
};
