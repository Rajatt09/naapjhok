const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Order must belong to a user']
    },
    profileId: {
        type: String,
        required: true,
        default: 'me'
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.Mixed, // Allow Number or ObjectId
            ref: 'Product',
        },
        // In case Product model is not fully used yet, we can store snapshot name/image
        name: String, 
        image: String,
        
        quantity: {
            type: Number,
            default: 1
        },
        withFabric: {
            type: Boolean,
            default: false
        },
        price: Number, 
        customization: String // JSON string or text
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Master Assigned', 'Measurements Taken', 'In Stitching', 'Trial Ready', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    appointment: {
        date: {
            type: Date,
            required: true
        },
        timeSlot: {
            type: String, 
            required: true
        },
        address: {
            street: String,
            city: String,
            state: String,
            zip: String
        },
        contactName: String,
        contactPhone: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Populate if referencing Products
// orderSchema.pre(/^find/, function(next) {
//     this.populate({
//         path: 'items.product',
//         select: 'name category image'
//     });
//     next();
// });

module.exports = mongoose.model('Order', orderSchema);
