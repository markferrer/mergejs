'use strict';


// Additional assumptions made and possible edge case scenarios:
//  1. The mergeObject(...) function below is implemented to be un-opinionated
//     about the data types of non-existent key/value pairs in the destination
//     object.
//
//     In the examples provided, a['logins'] is assumed to exist as an array
//     if b['logins'] is provided.
//
//     Otherwise, b['logins'] will be set as the value for a['logins'] if
//     a['logins'] is missing, null, or undefined instead of assuming that
//     b['logins'] is an object that belongs to an array in a['logins'] that
//     just happens to not exist.
//
//     To test this edge case using the provided examples (defined below as the
//     global a and b variables), set a['logins'] to undefined or remove the
//     key/value pair entirely. Then save and re-run this javascript file.


let parseType = function(val) {
    // Helper function to determine what data type we're working with.
    //
    // Returns an object with the following properties:
    //
    //  type: the raw data type string in the form of '[object Datatype]'
    //  isArray: helper function (true if val is an Array)
    //  isComplex: helper function (true if val is not (string, number, boolean, null, etc)
    //  isEmpty: helper function (true if val is null or undefined)

    let obj = {};

    obj.type = Object.prototype.toString.call(val);
    
    // Is our val null or undefined?
    obj.isEmpty = function() {
        if (obj.type === "[object Undefined]" || obj.type === "[object Null]") {
            return true;
        } else {
            return false;
        }
    }

    // Is our val an Array?
    obj.isArray = function() {
        return (obj.type === "[object Array]") ? true : false;
    }

    // Is our val a complex Object? (non-null, non-string, non-number, etc)
    obj.isComplex = function() {
        if (obj.type === "[object Object]" || obj.isArray(obj.type)) {
            return true;
        } else {
            return false;
        }
    }

    return obj;
}


function mergeObjects(objA, objB) {
    // Function to merge/save changes found in objB into objA.
    //
    // Returns objA after it has been updated with all changes defined in objB.

    if (parseType(objA).isEmpty()) {
        objA = {};
    }

    for (let field in objB) {
        let bType = parseType(objB[field]);
        let aType = parseType(objA[field]);

        // Handles cases where objB[field] is null or undefined
        // Fulfills requirements: 2 and 4
        if (bType.isEmpty()) {
            if (aType.isArray()) {
                objA[field] = [];
            } else {
                delete objA[field];
            }

            continue;
        }

        // Handles cases where objA[field] is an Array and objB[field] is not empty
        // Fulfills requirements: 1 and 3
        if (aType.isArray()) {
            if (bType.isArray()) {
                objA[field] = objB[field];
            } else {
                objA[field].push(objB[field]);
            };

            continue;
        }

        // Handles cases where objB[field] is a simple value
        // Fulfills requirements: 5
        if (!bType.isComplex()) {
            objA[field] = objB[field];

            continue;
        }

        // Handles cases where objB[field] is a non-array complex object
        if (bType.isComplex() && !bType.isArray()) {
            objA[field] = mergeObjects(objA[field], objB[field]);
        }
    }

    return objA;
}


// Below we run the examples given in the code challenge and output the results
// to the console.


let a = {
    first_name: 'Bob',
    last_name: 'Joness',

    email: 'bob@gmail.com',

    address: {
        line_1: '1234 Main St',
        line_2: 'Apt 413',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90048'
    },

    logins: [
        { date: '10/22/2012', ip: '192.168.0.1' },
        { date: '10/21/2012', ip: '192.168.0.1' }
    ],

    photos: [
        'IMG-1985.jpg',
        'IMG-1987.jpg'
    ]
}


let b = {
    last_name: 'Jones',
    active: true,

    address: {
        line_1: '2143 South Main St',
        line_2: undefined
    },

    logins: { date: '10/23/2012', ip: '192.168.0.1' },

    photos: undefined
}


console.log(mergeObjects(a, b));
