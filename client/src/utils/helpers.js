export function pluralize(name, count) {
  if (count === 1) {
    return name
  }
  return name + 's'
}


export function idbPromise(storeName, method, object) {
  return new Promise((resolve, reject) => {
    // open connection to the database 'shop-shop' with our version of 1
    const request = window.indexedDB.open('shop-shop', 1);

    // create variables to hold reference to our database, the transaction (tx), and the store
    let db, tx, store;

    // if the version has changed, or this is the first time using the database, run this method to create the object stores
    request.onupgradeneeded = function (e) {
      const db = request.result; 
      // create an object store for each type of data and set the "primary" key index to be the _id of the data that is being added to the store ---> so this will set the index of each item in the store based on its passed in _id key
      db.createObjectStore('products', { keyPath: '_id' });
      db.createObjectStore('categories', { keyPath: '_id' });
      db.createObjectStore('cart', { keyPath: '_id'});
    };

    // handle any errors with connection
    request.onerror = function(e) {
      console.log('There was an error');
    };

    // on database open success
    request.onsuccess = function(e) {
      // save a reference of the database to the 'db' variable
      db = request.result;
      // open a transaction to whatever we pass in as the storeName ---> meaning it has to match one of our three object stores created above
      tx = db.transaction(storeName, 'readwrite');
      // save a reference to this object store
      store = tx.objectStore(storeName);

      // if there are any errors, report them
      db.onerror = function(e) {
        console.log('error ', e); 
      };

      // determine which CRUD operation will be performed on the store that we are attempting a transaction with
      switch (method) {
        // put will add object to the store if there is no object in the store with the matching _id, if there is a matching _id, it will update that object 
        case 'put':
          store.put(object);
          resolve(object);
          break;
        case 'get':
          const all = store.getAll();
          all.onsuccess = function() {
            resolve(all.result);
          };
          break;
        case 'delete':
          store.delete(object._id);
          break;
        default:
          console.log('Entered method is not valid');
          break;
      }

      // when the transaction is complete, close the connection
      tx.oncomplete = function() {
        db.close();
      };
    };


  });
}