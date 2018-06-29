var TaffyModel = function (dbName) {
     var db = TAFFY(localStorage.getItem(dbName));
     db.dbName = dbName;
     // create auto increment
     db.settings({onInsert: function(){
         var maxId = db().max('id') || 0;
         this.id = maxId + 1;
     },onDBChange: function(){
         // export
         localStorage.setItem(dbName, JSON.stringify(this));
     }});

     return db;
};
(function(window){
    var db = {};
    db.accounts = TaffyModel('accounts');
    // accounts: name, name, email address, is_active
    db.accounts.settings(template: {is_active: true});

    db.urls = TaffyModel('urls');
    // urls: account_id, url, is_active
    db.urls.settings(template: {is_active: true});

    db.keys = TaffyModel('keys');
    // keys: account_id, name, type, privateKey, publicKey, deadline_ts, is_active
    db.urls.settings(template: {is_active: true, 'end-date': 0});
    
    window.db = db;
})(this)
