import { Router } from 'express';
import { db, EventDoc } from '../db/database';
import { AuthenticatedRequest, requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// GET all events
router.get('/', (req, res) => {
  const { search } = req.query;

  let list = [...db.events];
  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter((e) => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q));
  }

  list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return res.json({ success: true, data: list });
});

// POST create event (Admin only)
router.post('/', requireAuth, requireRole(['ADMIN']), (req: AuthenticatedRequest, res) => {
  const { title, description, date, time, venue, organizer, image, registrationLink } = req.body;

  if (!title || !date || !venue) {
    return res.status(400).json({ success: false, message: 'Title, date, and venue are required.' });
  }

  const newEvent: EventDoc = {
    _id: 'evt_' + Date.now(),
    title,
    description: description || '',
    date,
    time: time || '10:00 AM',
    venue,
    organizer: organizer || 'Campus Activities Board',
    image: image || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80',
    registrationLink: registrationLink || '',
    attendeesCount: 0,
    createdBy: req.user!.email,
  };

  db.events.push(newEvent);
  db.save();

  db.logAudit(req.user!.userId, req.user!.name, req.user!.role, 'EVENT_CREATED', 'Event', newEvent._id, `Created event ${title}`);

  return res.status(201).json({ success: true, message: 'Event created successfully', data: newEvent });
});

// POST RSVP for an event
router.post('/:id/rsvp', requireAuth, (req: AuthenticatedRequest, res) => {
  const event = db.events.find((e) => e._id === req.params.id);
  if (!event) {
    return res.status(404).json({ success: false, message: 'Event not found.' });
  }

  event.attendeesCount += 1;
  db.save();

  return res.json({
    success: true,
    message: `You have successfully RSVP'd for ${event.title}!`,
    attendeesCount: event.attendeesCount,
  });
});

// PUT update event (Admin only)
router.put('/:id', requireAuth, requireRole(['ADMIN']), (req: AuthenticatedRequest, res) => {
  const event = db.events.find((e) => e._id === req.params.id);
  if (!event) {
    return res.status(404).json({ success: false, message: 'Event not found.' });
  }

  const { title, description, date, time, venue, organizer, image, registrationLink } = req.body;
  if (title) event.title = title.trim();
  if (description !== undefined) event.description = description;
  if (date) event.date = date;
  if (time) event.time = time;
  if (venue) event.venue = venue.trim();
  if (organizer) event.organizer = organizer.trim();
  if (image) event.image = image;
  if (registrationLink !== undefined) event.registrationLink = registrationLink;

  db.save();
  db.logAudit(req.user!.userId, req.user!.name, req.user!.role, 'EVENT_UPDATED', 'Event', event._id, `Updated event: ${event.title}`);

  return res.json({ success: true, message: 'Event updated successfully.', data: event });
});

// DELETE event (Admin only)
router.delete('/:id', requireAuth, requireRole(['ADMIN']), (req: AuthenticatedRequest, res) => {
  const index = db.events.findIndex((e) => e._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Event not found.' });
  }

  const event = db.events[index];
  db.events.splice(index, 1);
  db.save();

  db.logAudit(req.user!.userId, req.user!.name, req.user!.role, 'EVENT_DELETED', 'Event', event._id, `Deleted event: ${event.title}`);

  return res.json({ success: true, message: `Event ${event.title} deleted successfully.` });
});

export default router;
