# httpdebugd

httpdebugd is a tiny little web service for debugging HTTP-related network connectivity issues if/when you experience them. It primarily powers the site at https://debug.charliejonas.co.uk/ however there's no reason the code cannot be adapted to run elsewhere.

## Usage

httpdebugd is compiled into a single static binary (including web assets) and there is no configuration to worry about. It's expected that the application will be run behind a reverse proxy such as nginx which will take care of things like TLS.

```
Usage:
  httpdebugd server [flags]

Flags:
  -b, --bind string     address and port to bind to (default "localhost:8080")
  -h, --help            help for server
```

## Compiling

It should be relatively simple to checkout and build the code, assuming you have a suitable [Go toolchain installed](https://go.dev/doc/install). Running the following commands in a terminal will compile binaries for various operating systems & processor architectures and place them in `./bin`:

```bash
git clone https://github.com/CHTJonas/httpdebugd.git
cd httpdebugd
make clean && make all
```

## Copyright

httpdebugd is licensed under the [BSD 2-Clause License](https://opensource.org/licenses/BSD-2-Clause).

Copyright (c) 2022 Charlie Jonas.
