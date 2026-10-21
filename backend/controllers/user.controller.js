import { userModel } from "../models/user.schema.js";
import crypto from "node:crypto";

// Generate a new mock API
export const generate = async (req, res) => {
  try {
    const jsonData = req.body;

    if (
      jsonData === undefined ||
      jsonData === null ||
      typeof jsonData !== "object"
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid JSON object or array."
      });
    }

    const endpointId = crypto.randomBytes(6).toString("hex");

    const mock = new userModel({
      endpointId,
      payload: jsonData
    });

    await mock.save();

    return res.status(201).json({
      success: true,
      message: "Mock API created successfully",
      endpointId,
      userURL: ` http://localhost:${process.env.PORT || 8000}/api/mock/${endpointId}`
    });

  } catch (error) {
    console.error("Upload error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate mock API."
    });
  }
};


// Serve the saved JSON payload
export const servePayload = async (req, res) => {
  try {
    const { endpointId } = req.params;

    const mockData = await userModel.findOne({ endpointId });

    if (!mockData) {
      return res.status(404).json({
        success: false,
        message: "Mock API not found."
      });
    }

    return res.status(200).json(mockData.payload);

  } catch (error) {
    console.error("Serve error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve mock API."
    });
  }
};

