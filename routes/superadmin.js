import dotenv from 'dotenv';
import express from 'express';
import fetchuser, { fetchIsAdmin } from '../middleware/fetchuser.js';
import Student from '../model/Students.js';

dotenv.config();

const router = express.Router();

// Route 1 : Create user using : POST "/admin/getadmin"
router.get('/getstudents', fetchuser, fetchIsAdmin, async (req, res) => {
    let success = false;

    try {
        let stds = await Student.find({ isActive: true });
        if (!stds) {
            return res.status(400).json({ success, message: "Students not found!" })
        }

        res.status(200).json({ success: true, data: stds })

    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Route 2 : Create new student using : POST "/admin/newstudent"
router.post('/newstudent', fetchuser, fetchIsAdmin, async (req, res) => {
    try {
        const { aadhar, name, gender, grade, address, contactnum, othercnum, feePrice, feePaid, subscriptionDate, expiryDate } = req.body;

        const student = await Student.findOne({ aadhar });
        if (student) {
            return res.status(400).json({ success: false, message: "Student already exists!" })
        }

        const feePending = feePaid < feePrice;

        let otherConNum = null;
        if (othercnum) {
            otherConNum = othercnum;
        }

        const newStudent = new Student({ aadhar, name, gender, grade, address, contactnum, othercnum: otherConNum, feePrice, feePaid, feePending, subscriptionDate, expiryDate });

        await newStudent.save();
        res.status(201).json({ success: true, message: 'Student added successfully...', data: newStudent });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Route 3 : Update student using : POST "/admin/updatestd"
router.put('/updatestd/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const updatedData = req.body;

        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found!' });
        }

        if (updatedData.aadhar) student.aadhar = updatedData.aadhar;
        if (updatedData.name) student.name = updatedData.name;
        if (updatedData.gender) student.gender = updatedData.gender;
        if (updatedData.grade) student.grade = updatedData.grade;
        if (updatedData.address) student.address = updatedData.address;
        if (updatedData.contactnum) student.contactnum = updatedData.contactnum;
        if (updatedData.othercnum) student.othercnum = updatedData.othercnum;
        if (updatedData.feePrice) student.feePrice = updatedData.feePrice;
        if (updatedData.feePaid) student.feePaid = updatedData.feePaid;
        if (updatedData.feePrice !== undefined || updatedData.feePaid !== undefined) {
            const feePrice = updatedData.feePrice;
            const feePaid = updatedData.feePaid;

            student.feePending = feePaid < feePrice;
        }
        if (updatedData.subscriptionDate) student.subscriptionDate = updatedData.subscriptionDate;
        if (updatedData.expiryDate) student.expiryDate = updatedData.expiryDate;
        if (updatedData.isActive) student.isActive = updatedData.isActive;

        await student.save();

        res.status(200).json({ success: true, message: 'Student updated successfully', data: student });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


// Route 4 : Create user using : POST "/admin/getadmin"
router.get('/getalumnistd', fetchuser, fetchIsAdmin, async (req, res) => {
    let success = false;

    try {
        let stds = await Student.find({ isActive: false });
        if (!stds) {
            return res.status(400).json({ success, message: "Alumni students not found!" })
        }

        res.status(200).json({ success: true, data: stds })

    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});


export default router;