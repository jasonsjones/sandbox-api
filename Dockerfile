FROM node

MAINTAINER Jason Jones

RUN useradd --user-group --create-home --shell /bin/false blacktab
ENV HOME=/home/blacktab

COPY . $HOME/
RUN chown -R blacktab:blacktab $HOME/

USER blacktab
WORKDIR $HOME/
RUN yarn install

CMD ["npm", "run", "dev"]
