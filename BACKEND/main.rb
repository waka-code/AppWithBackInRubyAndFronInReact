require 'sinatra/base'
require_relative 'routes/weather'

class Main < Sinatra::Base
  use WeatherRoutes
  run! if __FILE__ == $0
end