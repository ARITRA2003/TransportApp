import mongoose from "mongoose";

const TransportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "driver"
    },
    origin: {
      address: {
        type: String,
        required: true,
      },
      coordinates: {
        lat: {
          type: Number,
          required: true
        },
        lng: {
          type: Number,
          required: true
        },
      }
    },
    destination: {
      address: {
        type: String,
        required: true,
      },
      coordinates: {
        lat: {
          type:Number,
          required: true
        },
        lng: {
          type:Number,
          required: true
        },
      }
    },
    distance: {
      type: Number,
      required: true
    },
    estimatedTime: {
      type: Number,
      required: true,
    },
    goodsDescription: {
      type: String,
      required: true,
    },
    weight: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: [
        "Waiting For Driver",
        "Accepted",
        "Goods Collected",
        "En-route",
        "Goods Delivered",
      ],
      default: "Waiting For Driver",
    },
    price: {
      type: Number, // Price for the transport service
      required: true,
    },
    paymentId: {
      type: String,
    },
    orderId: {
      type: String,
    },
    signature: {
      type: String,
    },
    originOtp: {
      type: String,
      required: true,
      select: false
    },
    destinationOtp: {
      type: String,
      required: true,
      select: false
    }
  },
  {
    timestamps: true,
  }
);

const TransportModel = mongoose.model("Transport", TransportSchema);

export default TransportModel;

