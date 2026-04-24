import { Address } from "../../models/address.models.js";

const addAddress = async (req, res) => {
  try {
    const {
      userId,
      name,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      country,
      countryCode,
      phone,
      notes,
    } = req.body;

    if (
      !userId ||
      !name ||
      !addressLine1 ||
      !city ||
      !state ||
      !pincode ||
      !country ||
      !countryCode ||
      !phone
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, Address, City, State, PIN, Country, Country Code, and Phone are required",
      });
    }

    const newAddress = new Address({
      userId,
      name,
      addressLine1,
      addressLine2: addressLine2 || "",
      city,
      state,
      pincode,
      country,
      countryCode,
      phone,
      notes: notes || "",
    });

    await newAddress.save();

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      address: newAddress,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error adding address" });
  }
};

const fetchAllAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const addresses = await Address.find({ userId });
    // console.log(addresses, "address to yahi hai");
    if (!addresses) {
      return res
        .status(404)
        .json({ success: false, message: "No addresses found" });
    }
    // console.log(addresses, "this is address list")
    res.status(200).json({
      success: true,
      message: "Address fetched successfully",
      data: addresses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error fetching address" });
  }
};

const editAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const formData = req.body;
    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Address ID are required",
      });
    }

    const updatedAddress = await Address.findOneAndUpdate(
      {
        _id: addressId,
        userId,
      },
      formData,
      { new: true },
    );
    if (!updatedAddress) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address: updatedAddress,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error adding address" });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Address ID are required",
      });
    }

    const deletedAddress = await Address.findOneAndDelete({
      _id: addressId,
      userId,
    });
    if (!deletedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      address: deletedAddress,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error adding address" });
  }
};

export { addAddress, fetchAllAddress, editAddress, deleteAddress };
