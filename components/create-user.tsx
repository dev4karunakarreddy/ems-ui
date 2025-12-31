import * as React from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';

const steps = ['Personal Info', 'Contact Info', 'Role and Birth Info'];

interface Props {
  open: boolean;
  mode: 'create' | 'edit' | 'view';
  initialData: any | null;
  onOpen: () => void;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function CreateUser({
  open,
  mode,
  initialData,
  onOpen,
  onClose,
  onSubmit,
}: Props) {
  const isView = mode === 'view';

  const [activeStep, setActiveStep] = React.useState(0);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const [formData, setFormData] = React.useState({
    id: null,
    employee_id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    password: '1234567',
    role: '',
  });

  /* =========================
     Init form
  ========================= */
  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        id: null,
        employee_id: `EMP${Date.now()}`,
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        password: '1234567',
        role: '',
      });
    }
    setActiveStep(0);
    setErrors({});
  }, [initialData, open]);

  /* =========================
     Validation per step
  ========================= */
  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      if (!formData.first_name.trim()) {
        newErrors.first_name = 'First name is required';
      }
      if (!formData.last_name.trim()) {
        newErrors.last_name = 'Last name is required';
      }
    }

    if (step === 1) {
      if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = 'Enter a valid email';
      }
      if (!/^\d{10,}$/.test(formData.phone)) {
        newErrors.phone = 'Enter a valid phone number';
      }
    }

    if (step === 2) {
      if (!formData.date_of_birth) {
        newErrors.date_of_birth = 'Date of birth is required';
      }
      if (!formData.role.trim()) {
        newErrors.role = 'Role is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isStepFailed = (step: number) =>
    step === activeStep && Object.keys(errors).length > 0;

  /* =========================
     Handlers
  ========================= */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (!validateStep(activeStep)) return;

    if (activeStep === steps.length - 1) {
      onSubmit(formData);
    } else {
      setActiveStep((p) => p + 1);
      setErrors({});
    }
  };

  const handleBack = () => {
    setActiveStep((p) => p - 1);
    setErrors({});
  };

  /* =========================
     UI helpers
  ========================= */
  const fieldProps = {
    fullWidth: true,
    size: 'small' as const,
    margin: 'dense' as const,
    InputProps: { readOnly: isView },
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <>
            <TextField
              {...fieldProps}
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              error={!!errors.first_name}
              helperText={errors.first_name}
            />
            <TextField
              {...fieldProps}
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              error={!!errors.last_name}
              helperText={errors.last_name}
            />
          </>
        );

      case 1:
        return (
          <>
            <TextField
              {...fieldProps}
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              {...fieldProps}
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone}
            />
          </>
        );

      case 2:
        return (
          <>
            <TextField
              {...fieldProps}
              type="date"
              label="Date of Birth"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              error={!!errors.date_of_birth}
              helperText={errors.date_of_birth}
            />
            <TextField
              {...fieldProps}
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              error={!!errors.role}
              helperText={errors.role}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Icon trigger */}
      <Tooltip title="Add User">
        <IconButton color="primary" onClick={onOpen}>
          <PersonAddAltIcon />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {mode === 'create' && 'Add User'}
          {mode === 'edit' && 'Edit User'}
          {mode === 'view' && 'View User'}
        </DialogTitle>

        <DialogContent>
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 1 }}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel error={isStepFailed(index)}>
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box>{renderStep()}</Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleBack} disabled={activeStep === 0}>
            Back
          </Button>

          {mode !== 'view' ? (
            <Button variant="contained" onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          ) : (
            <Button onClick={onClose}>Close</Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
