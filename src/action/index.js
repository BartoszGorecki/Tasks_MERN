import axios from 'axios';
import store from "../store";
import { baseUrl } from '../utility/constant';
import { getActualFormattedDate } from '../utility/function';

// SET SEARCHED PHRASE & FETCH TASKS
export const FETCH_TASKS = 'FETCH_TASKS';
const fetchTasks = data => {
    return {
        type: FETCH_TASKS,
        data
    };
};
export const fetchTasksAPI = searchedText => dispatch => {
    const uriEndpoint = searchedText ? `/tasks?temat=${searchedText}` : '/tasks';
    return axios.get(baseUrl + uriEndpoint)
            .then(({ data, status, statusText }) => {
                if (status === 200 && statusText === 'OK') {
                    const filteredTasks = data.filter(task => task.temat.match(searchedText));
                    const tasks = filteredTasks.sort((a, b) => new Date(b.date) - new Date(a.date));
                    const finalForm = { searchedText, tasks };
                    dispatch(fetchTasks(finalForm));
                }  
            })
            .catch(err => console.warn(err));
};


// SET SELECTED TASK
export const SET_SELECTED_TASK = 'SET_SELECTED_TASK';
const setSelectedTask = data => {
    return {
        type: SET_SELECTED_TASK,
        data
    };
};
export const fetchSelectedTaskAPI = selectedTaskId => dispatch => {
    return axios.get(`${baseUrl}/tasks/${selectedTaskId}`)
            .then(({ data, status, statusText }) => {
                if (status === 200 && statusText === 'OK') {
                    dispatch(setSelectedTask(data));
                }  
            })
            .catch(err => console.warn(err));
};


// UPDATE SELECTED TASK
export const UPDATE_SELECTED_TASK = 'UPDATE_SELECTED_TASK';
const updateSelectedTask = (selectedTask, selectedTaskId) => {
    const filteredTasks = (store.getState().controlPanel.tasks).filter(task => task._id !== selectedTaskId);
    const updatedTasks = [ ...filteredTasks, selectedTask];
    return {
        type: UPDATE_SELECTED_TASK,
        data: updatedTasks
    };
};
export const updateSelectedTaskAPI = selectedTask => dispatch => {
    const selectedTaskId = selectedTask._id;
    return axios.put(`${baseUrl}/tasks/${selectedTaskId}`, selectedTask)
            .then(({ status, statusText }) => {
                if (status === 200 && statusText === 'OK') {
                    dispatch(updateSelectedTask(selectedTask, selectedTaskId));
                }  
            })
            .catch(err => console.warn(err));
};


// SET DATE
export const SET_TASK_DATE = 'SET_TASK_DATE';
const setTaskDate = selectedTask => {
    const filteredTasks = (store.getState().controlPanel.tasks).filter(task => task._id !== selectedTask._id);
    const updatedTasks = [ ...filteredTasks, selectedTask];
    return {
        type: SET_TASK_DATE,
        data: updatedTasks
    };
};
export const setTaskDateAPI = (selectedTaskId, action) => dispatch => {
    const tasks = store.getState().controlPanel.tasks;
    const selectedTask = tasks.filter(task => task._id === selectedTaskId)[0];
    selectedTask[action] = getActualFormattedDate();
    return axios.put(`${baseUrl}/tasks/${selectedTaskId}/${action}`, selectedTask)
            .then(({ status, statusText }) => {
                if (status === 200 && statusText === 'OK') {
                    dispatch(setTaskDate(selectedTask));
                }  
            })
            .catch(err => console.warn(err));
};