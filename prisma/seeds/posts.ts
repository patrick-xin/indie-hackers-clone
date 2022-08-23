import { faker } from '@faker-js/faker';
import { Post } from '@prisma/client';
import cuid from 'cuid';

const createPost = () => {
  const date = faker.date.between(
    '2020-01-01T00:00:00.000Z',
    '2022-08-04T00:00:00.000Z'
  );
  const authorIds = [
    { id: 'cl5hh8zze0435z00w4se6yc00' },
    { id: 'cl6edv3280000rm0w0kfwab1u' },
    { id: 'cl6edv3290001rm0w8ryoc9gi' },
    { id: 'cl6edv3290002rm0w9qm656vd' },
    { id: 'cl6edv3290003rm0wekul0omf' },
    { id: 'cl6edv3290004rm0w26ffaaz1' },
    { id: 'cl6edv3290005rm0wfdi8b1ll' },
    { id: 'cl6edv32a0006rm0w80ys5gch' },
    { id: 'cl6edv32a0007rm0wfbnu2p3i' },
    { id: 'cl6edv32a0008rm0wgnsf48bt' },
    { id: 'cl6edv32a0009rm0wbmphg7l9' },
    { id: 'cl6edv32a000arm0w13z5a9wl' },
    { id: 'cl6edv32a000brm0wecrnfa1n' },
    { id: 'cl6edv32a000crm0w44b76pzi' },
    { id: 'cl6edv32a000drm0w9a7e6o52' },
    { id: 'cl6edv32a000erm0w62l6bq80' },
    { id: 'cl6edv32a000frm0w4dcv5hfg' },
    { id: 'cl6edv32a000grm0w1to81vjj' },
    { id: 'cl6edv32a000hrm0w16vp55bg' },
    { id: 'cl6edv32a000irm0w86p9b4ha' },
    { id: 'cl6edv32a000jrm0wfbaf9pgi' },
    { id: 'cl6edv32a000krm0wgkpq74mw' },
    { id: 'cl6edv32a000lrm0waff4d2ya' },
    { id: 'cl6edv32a000mrm0w06bd9v3o' },
    { id: 'cl6edv32a000nrm0w19v06tka' },
    { id: 'cl6edv32a000orm0weeto31dk' },
    { id: 'cl6edv32a000prm0wdz4gd52y' },
    { id: 'cl6edv32a000qrm0w0e531sre' },
    { id: 'cl6edv32a000rrm0whjz0a2xo' },
    { id: 'cl6edv32b000srm0w71h589an' },
    { id: 'cl6edv32b000trm0w87yd2mmb' },
    { id: 'cl6edv32b000urm0wbp6kh762' },
    { id: 'cl6edv32b000vrm0w4nd81lmo' },
    { id: 'cl6edv32b000wrm0wfvjk97kc' },
    { id: 'cl6edv32b000xrm0w2gq15jt1' },
    { id: 'cl6edv32b000yrm0wd62z72uj' },
    { id: 'cl6edv32b000zrm0w8vo15xdi' },
    { id: 'cl6edv32b0010rm0w0mm6a1a4' },
    { id: 'cl6edv32b0011rm0wfre5fzlc' },
    { id: 'cl6edv32b0012rm0w0vk71qzb' },
    { id: 'cl6edv32b0013rm0w1nvsexbe' },
    { id: 'cl6edv32b0014rm0w5qko4cco' },
    { id: 'cl6edv32b0015rm0w1zikg6q0' },
    { id: 'cl6edv32b0016rm0w9emxfaep' },
    { id: 'cl6edv32b0017rm0w3fwtdjtg' },
    { id: 'cl6edv32b0018rm0w11w98rlk' },
    { id: 'cl6edv32b0019rm0w4i6s3hl9' },
    { id: 'cl6edv32b001arm0w6tfj66tp' },
    { id: 'cl6edv32b001brm0w824zbl8h' },
    { id: 'cl6edv32b001crm0wfjfqerru' },
    { id: 'cl6edv32b001drm0w6y0y3xk9' },
    { id: 'cl6edv32b001erm0wdwmyf59n' },
    { id: 'cl6edv32b001frm0w0kwnbzn4' },
    { id: 'cl6edv32b001grm0whvnv5q88' },
    { id: 'cl6edv32b001hrm0w4udj8udb' },
    { id: 'cl6edv32b001irm0w7pbuhsm0' },
    { id: 'cl6edv32b001jrm0wbllu0rrs' },
    { id: 'cl6edv32b001krm0w05pk7dzk' },
    { id: 'cl6edv32b001lrm0w7c4a22x0' },
    { id: 'cl6edv32b001mrm0w9n444uq5' },
    { id: 'cl6edv32b001nrm0w1mui380x' },
  ].map((id) => id.id);
  const random = Math.floor(Math.random() * authorIds.length);

  const post: Post = {
    slug: faker.lorem.slug(),
    title: faker.lorem.text(),
    content: faker.lorem.paragraphs(),
    view_count: 0,
    authorId: authorIds[random],
    createdAt: date,
    isPublished: true,
    id: cuid(),
    publishedAt: date,
    updatedAt: date,
    status: 'PUBLISHED',
    categoryId: 'cl5l5fdvz1437ca0wnt355w2t',
    postType: 'ARTICLE',
  };

  return post;
};

export const createPosts = (numPosts = 100) => {
  return Array.from({ length: numPosts }, createPost);
};
