# Layers

I try not to use spreadsheets now. I used to do amazing things with
Lotus but Excel has never been a favourite tool.

Libre Office's Calc is an even more frustrating program than Excel.

For a while I've been convinced that the answer is some sort of web
based program.

So here's an attempt to make one.


## The repo is called sheets but this is called *Layers*?

That's a sort of joke. Sheets sounds like "shits" which is what
spreadsheets are.


## What's the problem with ordinary spreadsheet programs?

I think the one standout thing is that they encourage a lack of
discipline around data transformation.

For example: you get a data file from somewhere, in a spreadsheet you
mutate it until it does what you want. Take columns out, whole rows,
add a header, add formulae, etc...

If each one of these things was a separate step then you could retrace
your steps in transforming the data and change the value of the data
but not it's form.

The spreadsheet might become safer as a program.

I don't see any reason to lose any usability to do this.


## Why *Layers*?

Because I think layers of tabular data, where each layer is a
transformation of the layer below, is a more powerful idea than just
your basic editable/computable cells.

A layer might add a formula for a cell to an underlying table. Or a
layer might have a program that totally transforms the underlying data
(to do a pivot, for example).

A layer might add data from an HTTP API or change formatting.

Each layer is separable from all the others. Individual layers could
be combined into more layers.

## Working on this

*caveat* - Yes, I always welcome people hacking on my stuff. Doesn't
mean I will pick up what you do, please don't be offended if I don't
want what you hacked, but *you* can use it.

But to hack on something you have to be able to build it. And oh my
word. Javascript.

See the file [BUILD.md](BUILD.md) for details.
