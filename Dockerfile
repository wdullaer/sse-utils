from mhart/alpine-node:4

ADD package.json package.json
RUN npm install

ADD .eslintignore .eslintignore
ADD lib/ lib/
ADD test/ test/

RUN npm run test