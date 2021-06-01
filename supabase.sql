drop table if exists urls;

create table urls (
  id text not null primary key,
  long_url text not null
);