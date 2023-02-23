import { currentUser, requireAuth } from '@bshfakelook/common';
import express from 'express';
import PostController from '../controllers/post.controller';
const router = express.Router();

router.get('/', currentUser, requireAuth, PostController.findAll);


export = router;