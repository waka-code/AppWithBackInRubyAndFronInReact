require 'sinatra/base'
require 'sinatra'
require 'net/http'
require 'json'
require 'dotenv'
require 'mongoid'
require_relative '../models/weather_data'
require 'sinatra/cross_origin'
require_relative '../services/weather_service'

Dotenv.load
API_KEY = ENV['API_KEY']
BASE_URL = ENV['URL']
SECTIONS = 'current,hourly'
LANGUAGE = 'en'
UNITS = 'auto'
Mongoid.load!(File.join(File.dirname(__FILE__), '..', 'config', 'mongoid.yml'))

class WeatherRoutes < Sinatra::Base
    configure do
        enable :cross_origin
      end
    
      before do
        response.headers['Access-Control-Allow-Origin'] = '*'
      end
    
      options "*" do
        response.headers["Allow"] = "GET, PUT, POST, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Authorization, Content-Type, Accept, X-User-Email, X-Auth-Token"
        response.headers["Access-Control-Allow-Origin"] = "*"
        200
      end
      
    #Get weather data by latitude and longitude
    get '/weather/latitud/:lat/longitud/:lon' do
      lat = params[:lat]
      lon = params[:lon]
      api_url = "#{BASE_URL}?lat=#{lat}&lon=#{lon}&sections=#{SECTIONS}&language=#{LANGUAGE}&units=#{UNITS}&key=#{API_KEY}"
    
      uri = URI(api_url)
      response = Net::HTTP.get_response(uri)
      result = WeatherService.handle_response(response)
    
      halt result[:status], result[:body]
      end
      
      # Post all data
      post '/weather/add_data' do
        data = JSON.parse(request.body.read)
        attributes = data['weather_attributes']
        response = WeatherService.insert_weather_data(data, attributes)
        content_type :json
        response.to_json
      end
      
      # Get all data
      get '/weather/all_data' do
        mag_type = params['mag_type']
        page = params['page'] ? params['page'].to_i : 1
        weather_data = WeatherService.get_weather_data(page, mag_type)
        content_type :json
        weather_data.to_json
      end
      
      # Add Commet
      post '/weather/add_comment' do
        request_body = JSON.parse(request.body.read)
        external_id = request_body['external_id']
        comment_body = request_body['body']
        comment = WeatherService.add_comment(external_id, comment_body)
        content_type :json
        comment.to_json
      end
  end


  WeatherRoutes.run! if __FILE__ == $0
