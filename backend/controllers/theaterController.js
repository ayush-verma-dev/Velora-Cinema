import Theater from "../models/Theater.js";

// Get all theaters
export const getAllTheaters = async (req, res) => {
  try {
    const theaters = await Theater.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      theaters,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to load theaters.",
    });
  }
};

// Create theater
export const createTheater = async (req, res) => {
  try {
    const { name, city, location, experience, screens } = req.body;

    const theater = await Theater.create({
      name,
      city,
      location,
      experience,
      screens,
    });

    res.status(201).json({
      success: true,
      theater,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create theater.",
    });
  }
};

// Update theater
export const updateTheater = async (req, res) => {
  try {
    const theater = await Theater.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!theater) {
      return res.status(404).json({
        success: false,
        message: "Theater not found.",
      });
    }

    res.json({
      success: true,
      theater,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update theater.",
    });
  }
};

// Delete theater
export const deleteTheater = async (req, res) => {
  try {
    const theater = await Theater.findById(req.params.id);

    if (!theater) {
      return res.status(404).json({
        success: false,
        message: "Theater not found.",
      });
    }

    await Theater.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Theater deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete theater.",
    });
  }
};