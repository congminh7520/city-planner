export const setLocalStorage =(id,value)=>{
    return localStorage.setItem(id,value)
}

export const getLocalStorage=(id)=>{
    return localStorage.getItem(id)
}

export const removeLocalStorage =(id)=>{
    return localStorage.removeItem(id)
}