

export function localStorageHelper (key : string, callback : Function)  {
    let data = {}
    try {
        data = JSON.parse(localStorage.getItem(key) ||'{}') || {}
    } catch {
        data = {}
    }

    const newData = callback(data);
    localStorage.setItem(key, JSON.stringify(newData));
}