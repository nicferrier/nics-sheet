# How to build

Building anything in Javscript requires a PhD in PHP level idiocy. So
here are the lecture notes.


## which version of node?

We use node but in fact we're really only using it for testing right
now. Though I also use it to run the webserver actually all the work
happens client side.

But this requires at least 6.3.1 of nodejs because of JSDOM for testing.

## getting ubuntu node?

The Ubuntu default might be what you need by now, otherwise you can
either install by hand or use a node specific package repository.

[Here](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)
are the details on the node repository for Debian/Ubuntu.

Basically you do:

```
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
```

*caveat* you should never just execute a script from the
 Internet. Always download it as text and check it first.


## Testing code

As of writing node does not support ES6 modules. I am using ES6
modules. Hence babelify is needed to get node to understand the test
code.

There's a file `test.sh` which defines the babel transformations for
node which allow testing.

To run all tests do:

```
bash test.sh
```

to run just one test, do, for example:

```
bash test.sh test-dom.js
```
