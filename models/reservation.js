/** Reservation for Lunchly */

const moment = require("moment");
const db = require("../db");

/** A reservation for a party */

class Reservation {
  constructor({ id, customerId, numGuests, startAt, notes }) {
    this.id = id;
    this.customerId = customerId;
    this.numGuests = numGuests;
    this.startAt = startAt;
    this.notes = notes;
  }

  /** formatter for startAt */

  getformattedStartAt() {
    return moment(this.startAt).format('MMMM Do YYYY, h:mm a');
  }

  /** get a reservation by ID. */
  static async get(id) {
    const result = await db.query(
      `SELECT id, 
              customer_id AS "customerId", 
              num_guests AS "numGuests", 
              start_at AS "startAt", 
              notes
         FROM reservations
         WHERE id = $1`,
      [id]
    );

    const reservation = result.rows[0];

    if (!reservation) {
      throw new Error(`No reservation found with ID: ${id}`);
    }

    return new Reservation(reservation);
  }

  /** given a customer id, find their reservations. */
  static async getReservationsForCustomer(customerId) {
    const results = await db.query(
      `SELECT id, 
           customer_id AS "customerId", 
           num_guests AS "numGuests", 
           start_at AS "startAt", 
           notes AS "notes"
         FROM reservations 
         WHERE customer_id = $1`,
      [customerId]
    );

    return results.rows.map(row => new Reservation(row));
  }

  /** Save this reservation. */
  async save() {
    if (this.startAt instanceof Date && !isNaN(this.startAt)) {
      const formattedStartAt = this.startAt.toISOString();

      if (this.id === undefined) {
        const result = await db.query(
          `INSERT INTO reservations (customer_id, num_guests, start_at, notes)
               VALUES ($1, $2, $3, $4)
               RETURNING id`,
          [this.customerId, this.numGuests, formattedStartAt, this.notes]
        );
        this.id = result.rows[0].id;
      } else {
        await db.query(
          `UPDATE reservations 
           SET customer_id=$1, num_guests=$2, start_at=$3, notes=$4
           WHERE id=$5`,
          [this.customerId, this.numGuests, formattedStartAt, this.notes, this.id]
        );
      }
    } else {
      throw new Error("Invalid startAt value; must be a valid Date object.");
    }
  }
}

module.exports = Reservation;
