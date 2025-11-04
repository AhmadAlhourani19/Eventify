import { Router } from 'express';
import ticketTypes from './ticketTypes.routes.js';
import orders from './orders.routes.js';
import payments from './payments.routes.js';
import checkins from './checkins.routes.js';
import events from './events.routes.js';
import customers from './customers.routes.js';

const router = Router();


router.use('/events', events);
router.use('/events', ticketTypes);
router.use('/orders', orders);
router.use('/orders', payments);
router.use('/checkins', checkins);
router.use('/customers', customers);

export default router;
