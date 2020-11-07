import express from 'express';
import http from 'http';
import socketio from 'socket.io';

import QL from './QuestionsList';

type callbackSocket = (socket: socketio.Socket) => void

export default class SocketsHolder {
  private io: socketio.Server;

  private static _instance: SocketsHolder;

  public static getInstance(httpServer?: http.Server): SocketsHolder {
    if (this._instance) return this._instance;
    if (httpServer && !this._instance) {
      this._instance = new SocketsHolder(httpServer);
      return this._instance;
    }
    throw new Error('non initialisé');
  }

  private constructor(httpServer: http.Server) {
    this.io = socketio(httpServer);
  }

  public onConnection(callback:(socket:socketio.Socket) => void) {
    this.io.on('connection', socket => {
      console.log(`Connexion d'un client ${socket.id}`);
      callback(socket);
    })
  }

  public emit(event: string, data:any) {
    this.io.emit(event, data);
  }

  public onEvent(event: string, listener:(data:any) => void) {
    this.io.on('connection', socket => {
      socket.on(event, listener);
    })
  }


}
