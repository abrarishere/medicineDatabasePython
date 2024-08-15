import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Medicine Schema
const MedicineSchema = new Schema({
    medicine_name: {
        type: String,
        required: true,
        maxlength: 255
    },
    quantity: {
        type: Number,
        default: null
    }
});

MedicineSchema.methods.toString = function() {
    return `<Medicine ${this.medicine_name}>`;
};

// Patient Schema
const PatientSchema = new Schema({
    mr_number: {
        type: String,
        unique: true,
        required: true,
        maxlength: 13
    },
    name: {
        type: String,
        required: true,
        maxlength: 100
    },
    father_name: {
        type: String,
        default: null,
        maxlength: 100
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        default: null
    },
    age: {
        type: Number,
        default: null
    },
    ward_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ward',
        required: true
    },
    phone_number: {
        type: String,
        default: null,
        maxlength: 20
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

PatientSchema.methods.toString = function() {
    return `<Patient ${this.name}>`;
};

// PatientMedicine Schema
const PatientMedicineSchema = new Schema({
    mr_number: {
        type: String,
        ref: 'Patient',
        required: true
    },
    medicine_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medicine',
        required: true
    },
    quantity: {
        type: Number,
        default: null
    },
    date: {
        type: Date,
        required: true
    }
});

PatientMedicineSchema.index({ mr_number: 1, medicine_id: 1, date: 1 }, { unique: true });

PatientMedicineSchema.methods.toString = function() {
    return `<PatientMedicine ${this.mr_number} - ${this.medicine_id}>`;
};

// Ward Schema
const WardSchema = new Schema({
    ward_name: {
        type: String,
        required: true,
        maxlength: 100
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

WardSchema.methods.toString = function() {
    return `<Ward ${this.ward_name}>`;
};

// Define Models
const Medicine = mongoose.model('Medicine', MedicineSchema);
const Patient = mongoose.model('Patient', PatientSchema);
const PatientMedicine = mongoose.model('PatientMedicine', PatientMedicineSchema);
const Ward = mongoose.model('Ward', WardSchema);

export { Medicine, Patient, PatientMedicine, Ward };
