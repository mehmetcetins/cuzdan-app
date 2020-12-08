let state = {
    categoryName:"",
}
const listeners = [];
export default {
    getState(){
        return state;
    },
    setState(newState){
        state = {...state,...newState};
        listeners.forEach(listeners=> listeners());
    },
    onChange(newListener){
        listeners.push(newListener);
        return ()=> {
            listeners.filter(listener => listener !== newListener)
        }
    }
}