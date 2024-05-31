import React, { useState, useEffect, useContext } from 'react';
import { NearContext } from '@/context';
import AddBreakForm from '@/components/AddBreakForm';
import EditBreaksForm from '@/components/EditBreaksForm';
import TaskSchedule from '@/components/TaskSchedule';
import { useNear } from '@/hooks/useNear';
import styles from '@/styles/Planner.module.css';

const Planner = () => {
  const { signedAccountId } = useContext(NearContext);
  const { breaks, fetchBreaks, addBreak, updateBreak, removeBreak, workingHours, tasks, addTask } = useNear(signedAccountId, 'week');
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [isAddBreakFormOpen, setAddBreakFormOpen] = useState(false);
  const [isEditBreaksFormOpen, setEditBreaksFormOpen] = useState(false);

  useEffect(() => {
    if (signedAccountId) {
      fetchBreaks(signedAccountId);
    }
  }, [signedAccountId, fetchBreaks]);

  const handlePrevWeek = () => {
    setCurrentWeek(prevWeek => {
      const newWeek = new Date(prevWeek);
      newWeek.setDate(newWeek.getDate() - 7);
      return newWeek;
    });
  };

  const handleNextWeek = () => {
    setCurrentWeek(prevWeek => {
      const newWeek = new Date(prevWeek);
      newWeek.setDate(newWeek.getDate() + 7);
      return newWeek;
    });
  };

  const getWeekDays = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + 1); // Monday as start of the week
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      weekDays.push(day);
    }
    return weekDays;
  };

  const addTestTask = () => {
    const testTask = { name: 'New Test Task', day: 'Wednesday', start: '09:00', end: '12:00' };
    addTask(testTask);
  };

  const weekDays = getWeekDays(currentWeek);

  return (
    <div className={styles.plannerContainer}>
      <div className={styles.header}>
        <button onClick={handlePrevWeek}>&larr;</button>
        <div className={styles.currentMonthYear}>
          {currentWeek.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
        <button onClick={handleNextWeek}>&rarr;</button>
        <div className={styles.buttonContainer}>
          <button onClick={() => setAddBreakFormOpen(true)}>Add Break</button>
          <button onClick={() => setEditBreaksFormOpen(true)}>Edit Breaks</button>
          <button onClick={addTestTask}>Add Test Task</button>
        </div>
      </div>
      <TaskSchedule tasks={tasks} />
      <AddBreakForm
        isOpen={isAddBreakFormOpen}
        onClose={() => setAddBreakFormOpen(false)}
        addBreak={addBreak}
      />
      <EditBreaksForm
        isOpen={isEditBreaksFormOpen}
        onClose={() => setEditBreaksFormOpen(false)}
        breaks={breaks}
        updateBreak={updateBreak}
        removeBreak={removeBreak}
      />
    </div>
  );
};

export default Planner;
