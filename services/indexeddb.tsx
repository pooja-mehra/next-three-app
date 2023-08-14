import { openDB } from 'idb';

 export  function IndexedDB() {

   return { 
     createDB(){openDB('animatenext', 1, {
        upgrade(db) {
            db.createObjectStore('store1');
            //db.createObjectStore('store2');
            },
        });
    },

    async getFromDB(key:string) {
        const db1 = await openDB('animatenext', 1);
        let list = new Array()
        await db1.get('store1', key).then((value)=> value && value.length > 0 && value.forEach((v:any) => {
            list.push(v)
        }))
        db1.close();
        return list
    },
      
    async addToDB(key:string,value:any) {
        const db1 = await openDB('animatenext', 1);
        db1.put('store1', value, key);
        db1.close();
    }}
}