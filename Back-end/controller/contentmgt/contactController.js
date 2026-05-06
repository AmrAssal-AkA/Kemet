const contact = require("../../model/contactSchema");

// Create Contact
const createContact = async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }
  const emailRegex = /^[a-z0-9_]*[A-Z][a-z0-9_]*@[a-z0-9]+\.[a-z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({
        message:
          "Invalid email format. Email must contain at least one uppercase letter and only _ and @ special characters.",
      });
  }
  const TextRegex = /^[a-zA-Z\s]+$/;
  if (
    !TextRegex.test(name) ||
    !TextRegex.test(subject) ||
    !TextRegex.test(message)
  ) {
    return res
      .status(400)
      .json({ message: "Fields must contain only letters and spaces." });
  }

  try {
    const Newcontacts = new contact({
      name: name,
      email: email,
      subject: subject,
      message: message,
    });
    await Newcontacts.save();
    res.status(200).json({ message: "Thank you for contacting us" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get All Contacts
const getAllContacts = async (req, res) => {
  try {
    const allcontacts = await contact.find();
    res.status(200).json(allcontacts);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get Single Contact
const getContactByName = async (req, res) => {
  const { name } = req.params;
  try {
    const contactByOne = await contact.findOne({ name: name });
    if (!contactByOne) {
      return res.status(404).json({ message: "Contact not found." });
    }
    res.status(200).json(contactByOne);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = { createContact, getAllContacts, getContactByName };
