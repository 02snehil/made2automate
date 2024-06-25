
//  ../controller/groupController.js

const Group = require('../models/Group');

exports.createGroup = async (req, res) => {
  try {
    const { groupName } = req.body;
    const group = new Group({ groupName, members: [req.user.userId] });
    await group.save();
    res.status(201).json({ message: 'Group created successfully', group });
  } catch (error) {
    res.status(500).json({ message: 'Error creating group', error });
  }
};

exports.joinGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    if (!group.members.includes(req.user.userId)) {
      group.members.push(req.user.userId);
      await group.save();
    }

    res.json({ message: 'Joined group successfully', group });
  } catch (error) {
    res.status(500).json({ message: 'Error joining group', error });
  }
};
