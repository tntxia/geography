create table country(
	id int NOT NULL auto_increment,
	name varchar(200),
	name_en varchar(200)
)

create table province(
	id int NOT NULL auto_increment,
	name varchar(200),
	name_en varchar(200),
	country_id int
)

drop table if exists city;

create table region(
	id int NOT NULL auto_increment,
	name varchar(200),
	name_en varchar(200),
	parent_id int,
	region_type varchar(10),
	level int,
	polygon text,
	center varchar(200),
)

create table city(
	id int NOT NULL auto_increment,
	name varchar(200),
	name_en varchar(200),
	province_id int
	
)



