import scrapy
from tutorial.items import FoodItem
import random


class FoodSpider(scrapy.Spider):
	name = "food"
	start_urls = [
		'http://www.thecheesecakefactory.com/menu'
	]

	def get_image(self, response):
		fi = response.meta['fi']
		fi['image'] =  (response.xpath('//div[@class="food-menu-item-photo"]/img/@src').extract_first())
		return fi

	def parse(self, response):
		items = []
		for food in response.xpath('//li[@class="has-photo"]'):
			fi = FoodItem()
			fi['link'] = food.xpath('a/@href').extract_first()
			fi['name'] = food.xpath('a/span[@class="item-title"]/text()').extract_first()
			fi['description'] = food.xpath('a/span[@class="item-description"]/text()').extract_first()
			fi['dishId'] = '001' + food.xpath('a/@data-internal').extract_first()
			fi['random'] = [random.random(), 0]
			request = scrapy.Request(('http://www.thecheesecakefactory.com' + fi['link']), self.get_image)
			request.meta['fi'] = fi

			yield request