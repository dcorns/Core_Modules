# Node FS

Callback, Promise, or Synchronus<br>
Only Promise and examples for only what works on all platforms<br/>
All depreciated content as of 4/23 is left out.

## fsPExamples.js

fsPromises Examples<br/>

**fsPromises.access(path[, mode])** Examples: 4<br/>
Tests a user's permissions for the file or directory specified by path. The mode argument is an optional integer that specifies the accessibility checks to be performed. mode should be either the value fs.constants.F_OK or a mask consisting of the bitwise OR of any of fs.constants.R_OK, fs.constants.W_OK, and fs.constants.X_OK<br/>
File access constants
The following constants are meant for use as the mode parameter passed to fsPromises.access(), fs.access(), and fs.accessSync().

Constant Description
F_OK Flag indicating that the file is visible to the calling process. This is useful for determining if a file exists, but says nothing about rwx permissions. Default if no mode is specified.
R_OK Flag indicating that the file can be read by the calling process.
W_OK Flag indicating that the file can be written by the calling process.
X_OK Flag indicating that the file can be executed by the calling process. This has no effect on Windows (will behave like fs.constants.F_OK).<br/>

**fsPromises.appendFile(path, data[, options])**<br/>
**fsPromises.chmod(path, mode)**<br/>
**fsPromises.chown(path, uid, gid)**<br/>
**fsPromises.copyFile(src, dest[, mode])**<br/>
**fsPromises.cp(src, dest[, options])**(experimental 4/23)<br/>
**fsPromises.lchmod(path, mode)**<br/>
**fsPromises.lchown(path, uid, gid)**<br/>
**fsPromises.lutimes(path, atime, mtime)**<br/>
**fsPromises.link(existingPath, newPath)**<br/>
**fsPromises.lstat(path[, options])**<br/>
**fsPromises.mkdir(path[, options])**<br/>
**fsPromises.mkdtemp(prefix[, options])**<br/>
**fsPromises.open(path, flags[, mode])**<br/>
**fsPromises.opendir(path[, options])**<br/>
**fsPromises.readdir(path[, options])**</br>
**fsPromises.readFile(path[, options])**<br/>
**fsPromises.readlink(path[, options])**<br/>
**fsPromises.realpath(path[, options])**<br/>
**fsPromises.rename(oldPath, newPath)**<br/>
**fsPromises.rmdir(path[, options])**<br/>
**fsPromises.rm(path[, options])**<br/>
**fsPromises.stat(path[, options])**<br/>
**fsPromises.statfs(path[, options])**<br/>
**fsPromises.symlink(target, path[, type])**<br/>
**fsPromises.truncate(path[, len])**<br/>
**fsPromises.unlink(path)**<br/>
**fsPromises.utimes(path, atime, mtime)**<br/>
**fsPromises.watch(filename[, options])**<br/>
**fsPromises.writeFile(file, data[, options])**<br/>
**fsPromises.constants**<br/>

## fileHandles

A FileHandle object is an object wrapper for a numeric file descriptor.

Instances of the FileHandle object are created by the fsPromises.open() method.

All FileHandle objects are EventEmitters.

#### EVENTS:

The 'close' event is emitted when the <FileHandle> has been closed and can no longer be used.

#### METHODS

**fsPromises.open(path, flags[, mode])** Examples: 1,2<br/><br/>

path string | Buffer | URL
flags string | number See support of file system flags. Default: 'r'.
mode string | integer Sets the file mode (permission and sticky bits) if the file is created. Default: 0o666 (readable and writable)
Returns: Promise Fulfills with a FileHandle object.
Opens a FileHandle.

Refer to the POSIX open(2) documentation for more detail.

Some characters (< > : " / \ | ? \*) are reserved under Windows as documented by Naming Files, Paths, and Namespaces. Under NTFS, if the filename contains a colon, Node.js will open a file system stream, as described by this MSDN page.

File system flags#
The following flags are available wherever the flag option takes a string.

'a': Open file for appending. The file is created if it does not exist.

'ax': Like 'a' but fails if the path exists.

'a+': Open file for reading and appending. The file is created if it does not exist.

'ax+': Like 'a+' but fails if the path exists.

'as': Open file for appending in synchronous mode. The file is created if it does not exist.

'as+': Open file for reading and appending in synchronous mode. The file is created if it does not exist.

'r': Open file for reading. An exception occurs if the file does not exist.

'r+': Open file for reading and writing. An exception occurs if the file does not exist.

'rs+': Open file for reading and writing in synchronous mode. Instructs the operating system to bypass the local file system cache.

This is primarily useful for opening files on NFS mounts as it allows skipping the potentially stale local cache. It has a very real impact on I/O performance so using this flag is not recommended unless it is needed.

This doesn't turn fs.open() or fsPromises.open() into a synchronous blocking call. If synchronous operation is desired, something like fs.openSync() should be used.

'w': Open file for writing. The file is created (if it does not exist) or truncated (if it exists).

'wx': Like 'w' but fails if the path exists.

'w+': Open file for reading and writing. The file is created (if it does not exist) or truncated (if it exists).

'wx+': Like 'w+' but fails if the path exists.

flag can also be a number as documented by open(2); commonly used constants are available from fs.constants. On Windows, flags are translated to their equivalent ones where applicable, e.g. O_WRONLY to FILE_GENERIC_WRITE, or O_EXCL|O_CREAT to CREATE_NEW, as accepted by CreateFileW.

The exclusive flag 'x' (O_EXCL flag in open(2)) causes the operation to return an error if the path already exists. On POSIX, if the path is a symbolic link, using O_EXCL returns an error even if the link is to a path that does not exist. The exclusive flag might not work with network file systems.

On Linux, positional writes don't work when the file is opened in append mode. The kernel ignores the position argument and always appends the data to the end of the file.

Modifying a file rather than replacing it may require the flag option to be set to 'r+' rather than the default 'w'.

The behavior of some flags are platform-specific. As such, opening a directory on macOS and Linux with the 'a+' flag, as in the example below, will return an error. In contrast, on Windows and FreeBSD, a file descriptor or a FileHandle will be returned.

// macOS and Linux
fs.open('<directory>', 'a+', (err, fd) => {
// => [Error: EISDIR: illegal operation on a directory, open <directory>]
});

// Windows and FreeBSD
fs.open('<directory>', 'a+', (err, fd) => {
// => null, <fd>
});
On Windows, opening an existing hidden file using the 'w' flag (either through fs.open(), fs.writeFile(), or fsPromises.open()) will fail with EPERM. Existing hidden files can be opened for writing with the 'r+' flag.

A call to fs.ftruncate() or filehandle.truncate() can be used to reset the file contents.

close

**filehandle.appendFile(data[, options])** Examples: 1, 2<br/>
data string | Buffer | TypedArray | DataView | AsyncIterable | Iterable | Stream
options Object | string
encoding string | null Default: 'utf8'
Returns: Promise Fulfills with undefined upon success.
Alias of filehandle.writeFile().

When operating on file handles, the mode cannot be changed from what it was set to with fsPromises.open(). Therefore, this is equivalent to filehandle.writeFile().

**filehandle.chmod(mode)** Examples: 4<br/>
Note: The Windows platform only supports the changing of the write permission. It also does not support the distinction between the permissions of user, group, or others.
**filehandle.chown(uid, gid)**<br/>
**filehandle.close()** Examples: 1, 2<br/>
Closes the file handle after waiting for any pending operation on the handle to complete.<br/>
**filehandle.createReadStream([options])** Example: 1<br/>
**filehandle.createWriteStream([options])**<br/>
**filehandle.datasync()**<br/>
Forces all currently queued I/O operations associated with the file to the operating system's synchronized I/O completion state. Refer to the POSIX fdatasync(2) documentation for details.<br/>
Unlike filehandle.sync this method does not flush modified metadata.<br/>
**filehandle.fd**<br/>
The numeric file descriptor managed by the FileHandle object.<br/>
**filehandle.read(buffer, offset, length, position)** Example 1<br>
**filehandle.readableWebStream()** (experimental 4/23)<br/>
**filehandle.readFile(options)** Examples: 1<br/>
**filehandle.readLines([options])** Examples: 2<br/>
**filehandle.readv(buffers[, position])**<br/>
**filehandle.stat([options])** Examples: 2<br/>
**filehandle.sync()** Examples: 2<br/>
Request that all data for the open file descriptor is flushed to the storage device. The specific implementation is operating system and device specific. Refer to the POSIX fsync(2) documentation for more detail.<br/>
**filehandle.truncate(len)** Examples: 2<br/>
**filehandle.utimes(atime, mtime)**Examples: 3<br/>
Change the file system timestamps of the object referenced by the FileHandle then resolves the promise with no arguments upon success.<br/>
**filehandle.write(buffer, offset[, length[, position]])**<br/>
**filehandle.write(buffer[, options])**<br/>
**filehandle.write(string[, position[, encoding]])**<br/>
It is unsafe to use _filehandle.write()_ multiple times on the same file without waiting for the promise to be resolved (or rejected). For this scenario, use _filehandle.createWriteStream()_.<br/>
On Linux, positional writes do not work when the file is opened in append mode. The kernel ignores the position argument and always appends the data to the end of the file.<br/>
**filehandle.writeFile(data, options)** Examples: 3<br/>
**filehandle.writev(buffers[, position])**<br/><br/><br/>

**fsPromises.access(path[, mode])**<br/>

#### Examples:

1. Open File, appendFile(string), Close File, Emmit File closed message, Open File again, Create a readStream, Use Stream Commands to stream(close, push, read), Read file into buffer, Close File, Open file again and use readFile to read the file, Close File

2. Open File, append some lines, close file, open file, read a line at a time, close file, Open file, truncate file, Read file into buffer, close file

3. open file, change meta dates, replace file text, close file

4. Check file visibility and read, write, execute permissions.

# Net

The node:net module provides an asynchronous network API for creating stream-based TCP or IPC(Inter-Proccess-Communications) servers (net.createServer()) and clients (net.createConnection()).<br/>

## Class: net.BlockList

The BlockList object can be used with some network APIs to specify rules for disabling inbound or outbound access to specific IP addresses, IP ranges, or IP subnets.<br/>

**blockList.addAddress(address[, type])**<br/>
**blockList.addRange(start, end[, type])**<br/>
**blockList.addSubnet(net, prefix[, type])**<br/>
**blockList.rules**<br/>

## Class: net.SocketAddress

**new net.SocketAddress([options])**<br/>
**socketaddress.address**<br/>
**socketaddress.family**<br/>
**socketaddress.flowlabel**<br/>
**socketaddress.port**<br/>

## Class: net.Server

Extends: EventEmitter<br/>
This class is used to create a TCP or IPC server.<br/>

**new net.Server([options][, connectionListener])**<br/>
net.Server is an EventEmitter with the following events:<br/>
**Event: 'close'**<br/>
**Event: 'connection'**<br/>
**Event: 'error'**<br/>
**Event: 'listening'**<br/>
**Event: 'drop'**<br/>
When the number of connections reaches the threshold of server.maxConnections, the server will drop new connections and emit 'drop' event instead.<br/>
**server.address()**<br/>
**server.close([callback])**<br/>
**server.getConnections(callback)**<br/>
**server.listen()**<br/>
**server.listen(handle[, backlog][, callback])**<br/>
**server.listen(options[, callback])**<br/>
**server.listen(path[, backlog][, callback])**<br/>
**server.listen([port[, host[, backlog]]][, callback]**<br/>
**server.listening**<br/>
**server.maxConnections**<br/>
**server.ref()**<br/>
**server.unref()**<br/>

## Class: net.Socket

Extends: stream.Duplex<br/>
This class is an abstraction of a TCP socket or a streaming IPC endpoint (uses named pipes on Windows, and Unix domain sockets otherwise). It is also an EventEmitter.<br/>
A net.Socket can be created by the user and used directly to interact with a server. For example, it is returned by net.createConnection(), so the user can use it to talk to the server.<br/>

It can also be created by Node.js and passed to the user when a connection is received. For example, it is passed to the listeners of a 'connection' event emitted on a net.Server, so the user can use it to interact with the client.<br/>

**new net.Socket([options])**<br/>
The newly created socket can be either a TCP socket or a streaming IPC endpoint, depending on what it connect() to.<br/>

**Event: 'close'**<br/>
**Event: 'connect'**<br/>
**Event: 'data'**<br/>
**Event: 'drain'**<br/>
**Event: 'end'**<br/>
**Event: 'error'**<br/>
**Event: 'lookup'**<br/>
**Event: 'ready'**<br/>
**Event: 'timeout'**<br/>
**socket.address()**<br/>
**socket.bytesRead**<br/>
**socket.bytesWritten**<br/>
**socket.connect()**<br/>
This function is asynchronous. When the connection is established, the 'connect' event will be emitted. If there is a problem connecting, instead of a 'connect' event, an 'error' event will be emitted with the error passed to the 'error' listener. The last parameter connectListener, if supplied, will be added as a listener for the 'connect' event once.<br/>
**socket.connect(path[, connectListener])**<br/>
**socket.connect(port[, host][, connectListener])**<br/>
**socket.connecting**<br/>
**socket.destroy([error])**<br/>
**socket.destroyed**</br>
**socket.destroySoon()**<br/>
**socket.end([data[, encoding]][, callback])**<br>
**socket.localAddress**<br/>
**socket.localPort**<br/>
**socket.localFamily**<br/>
**socket.pause()**<br/>
**socket.pending**<br/>
**socket.ref()**<br/>
**socket.remoteAddress**<br/>
**socket.remoteFamily**<br/>
**socket.remotePort**<br/>
**socket.resetAndDestroy()**<br/>
**socket.resume()**<br/>
**socket.setEncoding([encoding])**<br/>
**socket.setKeepAlive([enable][, initialDelay])**<br/>
**socket.setNoDelay([noDelay])**<br/>
**socket.setTimeout(timeout[, callback])**<br/>
**socket.timeout**<br/>
**socket.unref()**<br/>
**socket.write(data[, encoding][, callback])**<br/>
**net.connect()**<br/>
**net.connect(options[, connectListener])**<br/>
**net.connect(path[, connectListener])**<br/>
**net.connect(port[, host][, connectListener])**<br/>
**net.createConnection()**<br/>
**net.createConnection(path[, connectListener])**<br/>
**net.createConnection(port[, host][, connectListener])**<br/>
**net.createServer([options][, connectionListener])**<br/>
**net.isIP(input)**<br/>
**net.isIPv4(input)**<br/>
**net.isIPv6(input)**<br/>

# HTTP

The HTTP interfaces in Node.js are designed to support many features of the protocol which have been traditionally difficult to use. In particular, large, possibly chunk-encoded, messages. The interface is careful to never buffer entire requests or responses, so the user is able to stream data.<br/>

In order to support the full spectrum of possible HTTP applications, the Node.js HTTP API is very low-level. It deals with stream handling and message parsing only. It parses a message into headers and body but it does not parse the actual headers or the body.<br/>

**http.METHODS**<br/>
**http.STATUS_CODES**<br/>
**http.createServer([options][, requestListener])**<br>
**http.get(options[, callback])**<br/>
**http.get(url[, options][, callback])**<br/>
**http.globalAgent**<br/>
**http.maxHeaderSize**<br/>
**http.request(options[, callback])**<br/>
**http.request(url[, options][, callback])**<br/>
**http.validateHeaderName(name[, label])**<br/>
**http.validateHeaderValue(name, value)**<br/>
**http.setMaxIdleHTTPParsers(max)**<br/>
<br/>

## Class: http.Agent

It is good practice, to destroy() an Agent instance when it is no longer in use, because unused sockets consume OS resources.<br/>

**new Agent([options])**<br/>
**agent.createConnection(options[, callback])**<br/>
**agent.keepSocketAlive(socket)**<br/>
**agent.reuseSocket(socket, request)**<br/>
**agent.destroy()**<br/>
**agent.freeSockets**<br/>
**agent.getName([options])**<br/>
**agent.maxFreeSockets**<br/>
**agent.maxSockets**<br/>
**agent.maxTotalSockets**<br/>
**agent.requests**<br/>
**agent.sockets**<br/>

## Class: http.ClientRequest

Extends: <http.OutgoingMessage><br/>
This object is created internally and returned from http.request(). It represents an in-progress request whose header has already been queued. The header is still mutable using the setHeader(name, value), getHeader(name), removeHeader(name) API. The actual header will be sent along with the first data chunk or when calling request.end().

To get the response, add a listener for 'response' to the request object. 'response' will be emitted from the request object when the response headers have been received. The 'response' event is executed with one argument which is an instance of http.IncomingMessage.

During the 'response' event, one can add listeners to the response object; particularly to listen for the 'data' event.

If no 'response' handler is added, then the response will be entirely discarded. However, if a 'response' event handler is added, then the data from the response object must be consumed, either by calling response.read() whenever there is a 'readable' event, or by adding a 'data' handler, or by calling the .resume() method. Until the data is consumed, the 'end' event will not fire. Also, until the data is read it will consume memory that can eventually lead to a 'process out of memory' error.

For backward compatibility, res will only emit 'error' if there is an 'error' listener registered.

Set Content-Length header to limit the response body size. If response.strictContentLength is set to true, mismatching the Content-Length header value will result in an Error being thrown, identified by code: 'ERR_HTTP_CONTENT_LENGTH_MISMATCH'.

Content-Length value should be in bytes, not characters. Use Buffer.byteLength() to determine the length of the body in bytes.

**Event: 'close'**<br/>
**Event: 'connect'**<br/>
**Event: 'continue'**<br/>
**Event: 'finish'**<br/>
**Event: 'information'**<br/>
**Event: 'response'**<br/>
**Event: 'socket'**<br/>
**Event: 'timeout'**<br/>
**Event: 'upgrade'**<br/>
**request.cork()**<br/>
**request.end([data[, encoding]][, callback])**<br/>
**request.destroy([error])**<br/>
**request.destroyed**<br/>
**request.flushHeaders()**<br/>
**request.getHeader(name)**<br/>
**request.getHeaderNames()**<br/>
**request.getHeaders()**<br/>
**request.getRawHeaderNames()**<br/>
**request.hasHeader(name)**<br/>
**request.maxHeadersCount**<br/>
**request.path**<br/>
**request.method**<br/>
**request.host**<br/>
**request.protocol**<br/>
**request.removeHeader(name)**<br/>
**request.reusedSocket**<br/>
**request.setHeader(name, value)**<br/>
**request.setNoDelay([noDelay])**<br/>
**request.setSocketKeepAlive([enable][, initialDelay])**<br/>
**request.setTimeout(timeout[, callback])**<br/>
**request.socket**<br/>
**request.uncork()**<br/>
**request.writableEnded**<br/>
**request.writableFinished**<br/>
**request.write(chunk[, encoding][, callback])**<br/>

## Class: http.Server

Extends: net.Server<br/>

**Event: 'checkContinue'**<br/>
**Event: 'checkExpectation'**<br/>
**Event: 'clientError'**<br/>
**Event: 'close'**<br/>
**Event: 'connect'**<br/>
**Event: 'connection'**<br/>
**Event: 'dropRequest'**<br/>
**Event: 'request'**<br/>
**Event: 'upgrade'**<br/>
**server.close([callback])**<br/>
**server.closeAllConnections()**<br/>
**server.closeIdleConnections()**<br/>
**server.headersTimeout**<br/>
**server.listen()**<br/>
**server.listening**<br/>
**server.maxHeadersCount**<br/>
**server.requestTimeout**<br/>
**server.setTimeout([msecs][, callback])**<br/>
**server.maxRequestsPerSocket**<br/>
**server.timeout**<br/>
**server.keepAliveTimeout**<br/>

## Class: http.ServerResponse

Extends: <http.OutgoingMessage>
This object is created internally by an HTTP server, not by the user. It is passed as the second parameter to the 'request' event.<br/>

**Event: 'close'**<br/>
**Event: 'finish'**<br>

**response.addTrailers(headers)**<br/>
This method adds HTTP trailing headers (a header but at the end of the message) to the response.<br/>

Trailers will only be emitted if chunked encoding is used for the response; if it is not (e.g. if the request was HTTP/1.0), they will be silently discarded.<br/>

**response.cork()**<br/>
**response.end([data[, encoding]][, callback])**<br/>
This method signals to the server that all of the response headers and body have been sent; that server should consider this message complete. The method, response.end(), MUST be called on each response.<br/>

If data is specified, it is similar in effect to calling response.write(data, encoding) followed by response.end(callback).<br/>

If callback is specified, it will be called when the response stream is finished.<br/>

**response.flushHeaders()**<br/>
**response.getHeader(name)**<br/>
**response.getHeaderNames()**<br/>
**response.getHeaders()**<br/>
**response.hasHeader(name)**<br/>
**response.headersSent**<br/>
**response.removeHeader(name)**<br>
**response.req**<br/>
**response.sendDate**<br/>
**response.setHeader(name, value)**<br/>
**response.setTimeout(msecs[, callback])**<br/>
**response.socket**<br/>
**response.statusCode**<br>
**response.statusMessage**<br>
**response.strictContentLength**<br/>
**response.uncork()**<br/>
**response.writableEnded**<br/>
**response.writableFinished**<br/>
**response.write(chunk[, encoding][, callback])**<br/>
**response.writeContinue()**<br/>
**response.writeEarlyHints(hints[, callback])**<br/>
**response.writeHead(statusCode[, statusMessage][, headers])**<br/>
**response.writeProcessing()**<br/>

## Class: http.IncomingMessage

Extends: stream.Readable<br/>
An IncomingMessage object is created by http.Server or http.ClientRequest and passed as the first argument to the 'request' and 'response' event respectively. It may be used to access response status, headers, and data.<br/>

Different from its socket value which is a subclass of <stream.Duplex>, the IncomingMessage itself extends <stream.Readable> and is created separately to parse and emit the incoming HTTP headers and payload, as the underlying socket may be reused multiple times in case of keep-alive.<br/>

**Event: 'close'**<br/>
**message.complete**<br/>
**message.destroy([error])**<br/>
**message.headers**<br/>
**message.headersDistinct**<br/>
**message.httpVersion**<br/>
**message.method**<br/>
**message.rawHeaders**<br/>
**message.rawTrailers**<br/>
**message.setTimeout(msecs[, callback])**<br/>
**message.socket**<br/>
**message.statusCode**<br/>
**message.statusMessage**<br/>
**message.trailers**<br/>
**message.trailersDistinct**<br/>
**message.url**<br/>

## Class: http.OutgoingMessage

Extends: Stream<br/>
This class serves as the parent class of http.ClientRequest and http.ServerResponse. It is an abstract outgoing message from the perspective of the participants of an HTTP transaction.<br/>

**Event: 'drain'**<br/>
**Event: 'finish'**<br/>
**Event: 'prefinish'**<br/>
**outgoingMessage.addTrailers(headers)**<br/>
**outgoingMessage.appendHeader(name, value)**<br/>
**outgoingMessage.cork()**<br/>
**outgoingMessage.destroy([error])**<br/>
**outgoingMessage.end(chunk[, encoding][, callback])**<br/>
**outgoingMessage.flushHeaders()**<br/>
**outgoingMessage.getHeader(name)**<br/>
**outgoingMessage.getHeaderNames()**<br/>
**outgoingMessage.getHeaders()**<br/>
**outgoingMessage.hasHeader(name)**<br/>
**outgoingMessage.headersSent**<br/>
**outgoingMessage.pipe()**<br/>
**outgoingMessage.removeHeader(name)**<br/>
**outgoingMessage.setHeader(name, value)**<br/>
**outgoingMessage.setHeaders(headers)**<br/>
**outgoingMessage.setTimeout(msesc[, callback])**<br/>
**outgoingMessage.socket**<br/>
**outgoingMessage.uncork()**<br/>
**outgoingMessage.writableCorked**<br/>
**outgoingMessage.writableEnded**<br>
**outgoingMessage.writableFinished**<br>
**outgoingMessage.writableHighWaterMark**<br/>
**outgoingMessage.writableLength**<br/>
**outgoingMessage.writableObjectMode**<br/>
**outgoingMessage.write(chunk[, encoding][, callback])**<br/>
<br/>
