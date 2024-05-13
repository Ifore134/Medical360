import React, { useEffect } from 'react';
import dayjs from 'dayjs';
import {
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    ListItemText,
    Button,
    Box
} from '@mui/material';
import { useProcessContext } from '../hooks/useProcessContext';
import { useGlobalContext } from '../hooks/useGlobalContext';
import { useNavigate } from 'react-router-dom';
import Banner from '../components/Banner';
import { useAuthContext } from '../hooks/useAuthContext';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const ProcedureListItem = ({ label, value }) => {
    const isDischarged = value === 'Patient Discharged';
    const textStyle = isDischarged ? 'text-red-500' : 'text-gray-600';
    const { id_to_department } = useGlobalContext();

    return (
        <ListItem>
            <ListItemText>
                <Typography variant="body1" className={`font-medium ${textStyle}`}>
                    {label}:
                </Typography>
                <Typography variant="body2" className={textStyle}>
                    {isDischarged ? id_to_department[value] : value || 'N/A'}
                </Typography>
            </ListItemText>
        </ListItem>
    );
};

const ProcessDetailsPage = () => {
    const { currentProcess, updateProcess, getProcess, deleteProcedure } = useProcessContext();
    const { currentPatient, id_to_department } = useGlobalContext();
    const { user } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
      const fetchProcess = async () => {
        await getProcess(currentPatient.process);
      }
      fetchProcess();
    }, [])
    

    const handleProcessComplete = async (processId) => {
        if (currentProcess.procedures.length === 0) {
            alert("No procedures added");
            return;
        }
        let unfinishedProcedures = currentProcess.procedures.find(procedure => {
            return !procedure.completed;
        });
        if (unfinishedProcedures) {
            alert("Must complete all procedures first");
            return;
        }
        await updateProcess(processId, {
            completed: true,
            endDate: Date.now()
        });
        await getProcess(processId);
    };

    const handleProcessNotComplete = async (processId) => {
        await updateProcess(processId, {
            completed: false,
            endDate: null,
        });
        await getProcess(processId);
    };

    const handleProcedureComplete = async (procedureId) => {
        const updatedProcedures = currentProcess.procedures.map(procedure =>
            procedure._id === procedureId ? { ...procedure, completed: true } : procedure
        );

        await updateProcess(currentProcess._id, {
            procedures: updatedProcedures,
        });
        await getProcess(currentProcess._id);
    };

    const handleProcedureNotComplete = async (procedureId) => {
        const updatedProcedures = currentProcess.procedures.map(procedure =>
            procedure._id === procedureId ? { ...procedure, completed: false } : procedure
        );

        await updateProcess(currentProcess._id, {
            procedures: updatedProcedures,
            completed: false
        });
        await getProcess(currentProcess._id);
    };

    const handleEditProcedure = async (procedure, editable)=> {
        let options = {
            initOperation: procedure.operation,
            initNotes: procedure.notes,
            initDoctor: procedure.doctor,
            initRoom: procedure.roomNo,
            initDepartment: procedure.department,
            initStartDate: procedure.start,
            initEndDate: procedure.end,
            editable
        }
        navigate("/add-procedure", { state: {...options, id: procedure._id} });
    }

    const handleAddProcedure = async () => {
        let options = {
            initOperation: "",
            initNotes: "",
            initDoctor: "",
            initRoom: "",
            initDepartment: null,
            initStartDate: null,
            initEndDate: null,
            editable: true
        }
        navigate('/add-procedure', { state: options})
    }

    const handleDeleteProcedure = async procedureId => {
        await deleteProcedure(currentProcess._id, procedureId);
        await getProcess(currentProcess._id);
    }

    return (
        <>
            <Banner goBackPath="/all-processes" />
            <Box
                sx={{
                    backgroundColor: '#f0f5f9',
                    borderRadius: 8,
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                    padding: '24px',
                    margin: 'auto',
                    maxWidth: '600px',
                    mt: '24px',
                    position: 'relative', // Ensure button remains fixed
                    overflowY: 'auto' // Enable scrolling for procedures
                }}
            >
                <Typography variant="h5" align="center" mb={4}>
                    Process for {currentPatient.patientName}
                </Typography>
                <List>
                    {currentProcess && currentProcess.procedures.map((procedure) => (
                        <Card key={procedure._id} sx={{ marginBottom: '16px', backgroundColor: "primary"}}>
                            <CardContent>
                                <Typography variant="body1" className="font-medium text-gray-600" mb={2}>
                                    Start: {dayjs(procedure.start).format('YYYY-MM-DD HH:mm:ss')}
                                </Typography>
                                <Typography variant="body1" className="font-medium text-gray-600" mb={2}>
                                    End: {dayjs(procedure.end).format('YYYY-MM-DD HH:mm:ss')}
                                </Typography>
                                <List disablePadding>
                                    {Object.keys(procedure).map((field, index) => {
                                        if (field === "department") { 
                                            return <ProcedureListItem key={index} label={field} value={id_to_department[procedure[field]]} />
                                        }
                                        else if (field !== '_id' && field !== 'date' && field !== 'doctor' && field !== 'completed' && field !== 'start' && field !== 'end')
                                            return <ProcedureListItem key={index} label={field} value={procedure[field]} />
                                        }
                                    )}
                                </List>
                                {!procedure.completed ? (
                                    <>
                                        <Button
                                            variant="contained"
                                            onClick={() => handleProcedureComplete(procedure._id)}
                                            sx={{ position: 'relative', backgroundColor: '#34c759', margin: "6px", '&:hover': {
                                                backgroundColor: '#30a14e', // Change to the desired green color when hovering
                                            }}}
                                        >
                                            Complete
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleEditProcedure(procedure, false)}
                                            sx={{ position: 'relative'}}
                                        >
                                            View
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleEditProcedure(procedure, true)}
                                            sx={{ position: 'relative', margin: "6px"}}
                                            disabled={!(user.doctor === procedure.doctor || user.isAdmin)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => handleDeleteProcedure(procedure._id)}
                                            sx={{ position: 'relative'}}
                                            disabled={!(user.doctor === procedure.doctor || user.isAdmin)}
                                        >
                                            Delete
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Typography
                                            variant="contained"
                                            sx={{ margin: "8px", backgroundColor: '#34c759', color: 'white', padding: '8px 8px', borderRadius: '4px', position: 'relative', top: "4px" }}
                                        >
                                            Procedure Completed
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => handleProcedureNotComplete(procedure._id)}
                                            sx={{ position: 'relative' }}
                                        >
                                            Mark Procedure as Not Completed
                                        </Button>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </List>
                {currentProcess && <>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleAddProcedure()}
                        sx={{ position: 'relative', bottom: '16px', margin: "16px"}}
                        disabled={currentProcess.completed}
                    >
                        Add Procedure
                    </Button>
                    {!currentProcess.completed ? <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleProcessComplete(currentProcess._id)}
                        sx={{ position: 'relative', bottom: '16px'}}
                    >
                        Complete Process
                    </Button> : 
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleProcessNotComplete(currentProcess._id)}
                        sx={{ position: 'relative', bottom: '16px'}}
                    >
                        Mark Process as Not Completed
                    </Button>}
                </>}
            </Box>
        </>
    );
};

export default ProcessDetailsPage;