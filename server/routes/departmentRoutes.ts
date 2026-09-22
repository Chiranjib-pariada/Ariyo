import { Router } from 'express';
import { db, DepartmentDoc } from '../db/database';
import { AuthenticatedRequest, requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', (req, res) => {
  return res.json({
    success: true,
    data: db.departments,
  });
});

router.post('/', requireAuth, requireRole(['ADMIN']), (req: AuthenticatedRequest, res) => {
  const { name, code, hod, description, status } = req.body;
  if (!name || !code) {
    return res.status(400).json({ success: false, message: 'Name and Code are required.' });
  }

  const newDept: DepartmentDoc = {
    _id: 'dept_' + code.toLowerCase().replace(/[^a-z0-9]/g, ''),
    name,
    code: code.toUpperCase(),
    hod: hod || 'To be appointed',
    description: description || '',
    status: status || 'Active',
    studentCount: 0,
    facultyCount: 0,
  };

  db.departments.push(newDept);
  db.save();

  db.logAudit(req.user!.userId, req.user!.name, req.user!.role, 'DEPARTMENT_CREATED', 'Department', newDept._id, `Created department: ${name}`);

  return res.status(201).json({
    success: true,
    message: 'Department created successfully',
    data: newDept,
  });
});

// PUT update department (Admin only)
router.put('/:id', requireAuth, requireRole(['ADMIN']), (req: AuthenticatedRequest, res) => {
  const dept = db.departments.find((d) => d._id === req.params.id);
  if (!dept) {
    return res.status(404).json({ success: false, message: 'Department not found.' });
  }

  const { name, code, hod, headOfDepartment, description, status } = req.body;
  if (name) dept.name = name.trim();
  if (code) dept.code = code.trim().toUpperCase();
  if (hod || headOfDepartment) dept.hod = (hod || headOfDepartment).trim();
  if (description !== undefined) dept.description = description;
  if (status) dept.status = status;

  db.save();
  db.logAudit(req.user!.userId, req.user!.name, req.user!.role, 'DEPARTMENT_UPDATED', 'Department', dept._id, `Updated department: ${dept.name}`);

  return res.json({
    success: true,
    message: 'Department updated successfully.',
    data: dept,
  });
});

// DELETE department (Admin only)
router.delete('/:id', requireAuth, requireRole(['ADMIN']), (req: AuthenticatedRequest, res) => {
  const index = db.departments.findIndex((d) => d._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Department not found.' });
  }

  const dept = db.departments[index];
  db.departments.splice(index, 1);
  db.save();

  db.logAudit(req.user!.userId, req.user!.name, req.user!.role, 'DEPARTMENT_DELETED', 'Department', dept._id, `Deleted department: ${dept.name}`);

  return res.json({
    success: true,
    message: `Department ${dept.name} removed successfully.`,
  });
});

export default router;
