"use strict";

const { FRIEND_ACCEPTED, FRIEND_PENDING } = require("../config/constants");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // const friend = [];
    // for (let i = 84; i < 103; i++) {
    //   for (let j = i + 1; j <= 103; j++) {
    //     friend.push({
    //       status: FRIEND_ACCEPTED,
    //       created_at: new Date(),
    //       updated_at: new Date(),
    //       requester_id: i,
    //       accepter_id: j
    //     });
    //   }
    // }

    return queryInterface.bulkInsert("friends", friend);

    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    // 84 - 101

    // return queryInterface.bulkInsert("friends", [
    //   {
    //     status: FRIEND_ACCEPTED,
    //     created_at: new Date(),
    //     updated_at: new Date(),
    //     requester_id: 95,
    //     accepter_id: 92
    //   }
    // ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    return queryInterface.bulkDelete("friend", null, {});
  }
};
