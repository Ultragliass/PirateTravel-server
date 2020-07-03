import express from "express";

export interface JWTRequest extends express.Request {
  user?: any;
}
