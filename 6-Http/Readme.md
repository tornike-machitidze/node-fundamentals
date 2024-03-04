http is just a protocol/rules which uses all other layers to make comunication.
http does not sends or makes connection. it uses tcp layer or tcp protocol to make data sharing.
which uses network layer(all the ip adresses) to make connection
which by istself uses data link layer switches Mac adresses to give data to network card all happens
using cabels.

Http is a rules/protocol of how the data we are sharing/sending/getting should look like.
for example: first 4 bytes is for header. the next 6 bytes for body. and so on.
so it is just a predefined set of rules how the data we are sharing should look like.

1. Http says how the data should look like:
2. Transmision control protocol: how to check if data we send is that one the destination got.
3. Network layer checks ip adresses and make them connected
4. Data link layer know mac adresses
5. cabels are used to navigate 0 and 1

---

---

---

Main Objects

using Node.js we can create either http Server or http Client

                   Server                  |                 Client
                   http.Server             |               http.Agent
                   http.ServerResponse     |               http.ClientRequest
                      |                                           |
                      |                    ||                     |
                      |             http.IncomingMessage          |
                      |_____________http.OutgoungMessage  ---------


                  http.createServer() --> http.Server
                  http.request() -------> hhtp.Request
