# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html

import scrapy


class FoodItem(scrapy.Item):
	link = scrapy.Field()
	name = scrapy.Field()
	description = scrapy.Field()
	image = scrapy.Field()
	dishId = scrapy.Field()
	random = scrapy.Field()