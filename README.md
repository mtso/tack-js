# Thumbtack's Simple Database Challenge

Javascript solution to [Thumbtack's Simple Database Challenge](https://www.thumbtack.com/challenges/simple-database).

## Usage

This project requires at least node.js v4.6.1.

To install and run the project:
```
$ git clone https://github.com/mtso/tack-js
$ node tack-js
```

To use a test file:
```
$ node tack-js < ./tack-js/test/cmd-1.txt
```

## Process

I started with the GET, SET, and UNSET commands to make sure that it would
be possible to use Javascript objects as buckets to store variables.
I next dealt with the NUMEQUALTO command by creating another Javascript
object to keep track of value counts. This makes the lookup speed for 
values and value counts faster at the expense of memory and input speed.

For the transactions, I first tried saving a snapshot of the storage
and count objects nested into a root object. Each transaction block 
assigns the changes on top of its previous snapshot when the user issues
a COMMIT command. This violates the performance requirement for the
memory usage of transactions, because each BEGIN command duplicates the 
existing storage.

My next idea to solve this problem was to save a list of commands per 
transactional block, and then play these commands on top of one another 
upon COMMIT. However, in order to retrieve a value, each transaction
needs to be checked. If the latest transaction does not contain a value
for the given name, the next latest transaction is checked, and so on 
until all the transactions are checked. This makes keeping track of 
where data is actually stored very time consuming.

The final solution is to apply all SET and UNSET commands directly onto
the storage objects, and to only save the previous state of each variable
that is SET or UNSET during the current transaction block. I came to the
realization that the only time the storage needs to be undone is during
a ROLLBACK. In a ROLLBACK, the previous state of each variable is applied 
back onto the single storage object, and if the previous value associated 
with a name is undefined, it is directly deleted off the storage object.
The result of keeping the storage object up-to-date at each step is that 
the COMMIT command only needs to wipe the transaction history to permanently 
apply all transactional changes.

## Performance

// to be written
