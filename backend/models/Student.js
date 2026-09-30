const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: [true, 'Student ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
      minlength: [2, 'Student ID must contain at least 2 characters'],
      maxlength: [20, 'Student ID cannot exceed 20 characters'],
      index: true
    },

    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
      minlength: [2, 'Student name must contain at least 2 characters'],
      maxlength: [100, 'Student name cannot exceed 100 characters']
    },

    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: [150, 'Email cannot exceed 150 characters'],

      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address'
      ],

      index: true
    },

    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
      match: [
        /^[6-9]\d{9}$/,
        'Please provide a valid 10-digit Indian mobile number'
      ]
    },

    branch: {
      type: String,
      required: [true, 'Branch is required'],
      enum: {
        values: ['CSE', 'IT', 'EXTC', 'Mechanical', 'Civil', 'Electrical'],
        message: 'Please select a valid branch'
      },
      index: true
    },

    semester: {
      type: Number,
      required: [true, 'Semester is required'],
      min: [1, 'Semester cannot be less than 1'],
      max: [8, 'Semester cannot be greater than 8'],
      validate: {
        validator: Number.isInteger,
        message: 'Semester must be a whole number'
      }
    },

    cgpa: {
      type: Number,
      required: [true, 'CGPA is required'],
      min: [0, 'CGPA cannot be less than 0'],
      max: [10, 'CGPA cannot be greater than 10']
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

// Compound index for branch + semester filtering
studentSchema.index({
  branch: 1,
  semester: 1
})

// Text search index
studentSchema.index({
  name: 'text',
  email: 'text'
})

// Normalize name before saving

studentSchema.pre('save', async function () {
  if (this.name) {
    this.name = this.name
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase())
  }
})

const Student = mongoose.model('Student', studentSchema)

module.exports = Student
