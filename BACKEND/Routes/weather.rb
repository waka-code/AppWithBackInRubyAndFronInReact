require 'sinatra/base'
require 'sinatra'
require 'net/http'
require 'json'
require 'dotenv'
require 'mongoid'
require_relative '../models/weather_data'
require 'sinatra/cross_origin'

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
      
        case response
        when Net::HTTPSuccess
          weather_data = JSON.parse(response.body)
          content_type :json
          weather_data.to_json
        when Net::HTTPClientError
          halt 400, "Client error: #{response.message}"
        when Net::HTTPServerError
          halt 500, "Server error: #{response.message}"
        else
          halt 500, "Unknown error: #{response.message}"
        end
      end
      
      
      # Post all data
      post '/weather/add_data' do
        data = JSON.parse(request.body.read)
        attributes = data['weather_attributes']
        
        weather_data = WeatherData.new(
          type: data['type'],
          external_id: attributes['external_id'],
          magnitude: attributes['magnitude'],
          place: attributes['place'],
          tsunami: attributes['tsunami'],
          mag_type: attributes['mag_type'],
          title: attributes['title'],
          coordinates: attributes['coordinates'],
          links: data['links']
        )
      
        if weather_data.valid? && weather_data.save
          status 200
          body "Data inserted successfully"
        elsif weather_data.errors[:external_id].include?("is already taken")
          status 409
          body "Data with this external_id already exists"
        else
          status 500
          body "Error inserting data"
        end
      end
      
      # Get all data
      get '/weather/all_data' do
        mag_type = params['mag_type']
        page = params['page'] ? params['page'].to_i : 1
        offset = (page - 1) * 10
        query = WeatherData
        query = query.where(mag_type: mag_type) if mag_type
        weather_data = query.offset(offset).limit(10)
        content_type :json
        weather_data.to_json
      end
      
      # Add Commet
      post '/weather/add_comment' do
        request_body = JSON.parse(request.body.read)
        external_id = request_body['external_id']
        comment_body = request_body['body']
      
        if comment_body.strip.empty?
          status 400
          return { error: 'Comment body cannot be empty' }.to_json
        end
      
        weather_data = WeatherData.find_by(external_id: external_id)
        if weather_data.nil?
          status 404
          return { error: 'WeatherData not found' }.to_json
        end
        comment = weather_data.comments.create(body: comment_body)
        content_type :json
        comment.to_json
      end
  end


  WeatherRoutes.run! if __FILE__ == $0
