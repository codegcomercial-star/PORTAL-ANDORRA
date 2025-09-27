'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

// Componente para iconos del clima
const WeatherIcon = ({ condition, size = "w-12 h-12" }: { condition: string; size?: string }) => {
  const iconMap: { [key: string]: string } = {
    'sunny': '☀️',
    'partly-cloudy': '⛅',
    'cloudy': '☁️',
    'light-rain': '🌦️',
    'rain': '🌧️',
    'heavy-rain': '⛈️',
    'snow': '❄️',
    'heavy-snow': '��️',
    'fog': '🌫️',
    'wind': '💨'
  };

  return (
    <div className={`${size} flex items-center justify-center text-4xl weather-icon`}>
      {iconMap[condition] || '☀️'}
    </div>
  );
};

export default function ClimaContent() {
  const t = useTranslations('ClimaPage');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Datos meteorológicos actuales
  const climaActual = {
    temperatura: 8,
    sensacion: 5,
    humedad: 75,
    viento: 12,
    direccionViento: 'NE',
    presion: 1018,
    uvIndex: 2,
    uvLevel: 'Bajo',
    condicion: 'Parcialmente nublado',
    icon: 'partly-cloudy'
  };

  // Previsión por partes del día (HOY)
  const previsionHoy = [
    {
      periodo: 'Mañana',
      hora: '06:00 - 12:00',
      temp: { min: 2, max: 8 },
      condition: 'partly-cloudy',
      desc: 'Parcialmente nublado',
      precipitacion: 10,
      viento: 8,
      humedad: 80
    },
    {
      periodo: 'Tarde',
      hora: '12:00 - 18:00',
      temp: { min: 8, max: 12 },
      condition: 'sunny',
      desc: 'Soleado',
      precipitacion: 5,
      viento: 12,
      humedad: 65
    },
    {
      periodo: 'Noche',
      hora: '18:00 - 24:00',
      temp: { min: 4, max: 8 },
      condition: 'light-rain',
      desc: 'Lluvia ligera',
      precipitacion: 45,
      viento: 18,
      humedad: 85
    }
  ];

  // Pronóstico extendido 7 días
  const pronostico7Dias = [
    { 
      dia: "Hoy", 
      fecha: "26 Sep",
      min: 2, 
      max: 12, 
      condition: "partly-cloudy", 
      desc: "Parcialmente nublado",
      precipitacion: 15,
      viento: 12,
      humedad: 75,
      uvIndex: 3,
      amanecer: '07:45',
      atardecer: '19:30'
    },
    { 
      dia: "Mañana", 
      fecha: "27 Sep",
      min: 0, 
      max: 8, 
      condition: "light-rain", 
      desc: "Lluvia ligera",
      precipitacion: 65,
      viento: 18,
      humedad: 88,
      uvIndex: 1,
      amanecer: '07:46',
      atardecer: '19:28'
    },
    { 
      dia: "Sábado", 
      fecha: "28 Sep",
      min: -2, 
      max: 6, 
      condition: "snow", 
      desc: "Nevadas",
      precipitacion: 85,
      viento: 25,
      humedad: 92,
      uvIndex: 1,
      amanecer: '07:47',
      atardecer: '19:26'
    },
    { 
      dia: "Domingo", 
      fecha: "29 Sep",
      min: 1, 
      max: 7, 
      condition: "cloudy", 
      desc: "Nublado",
      precipitacion: 30,
      viento: 15,
      humedad: 82,
      uvIndex: 2,
      amanecer: '07:48',
      atardecer: '19:24'
    },
    { 
      dia: "Lunes", 
      fecha: "30 Sep",
      min: 3, 
      max: 11, 
      condition: "partly-cloudy", 
      desc: "Sol y nubes",
      precipitacion: 20,
      viento: 10,
      humedad: 70,
      uvIndex: 4,
      amanecer: '07:49',
      atardecer: '19:22'
    },
    { 
      dia: "Martes", 
      fecha: "1 Oct",
      min: 5, 
      max: 14, 
      condition: "sunny", 
      desc: "Soleado",
      precipitacion: 5,
      viento: 8,
      humedad: 62,
      uvIndex: 5,
      amanecer: '07:50',
      atardecer: '19:20'
    },
    { 
      dia: "Miércoles", 
      fecha: "2 Oct",
      min: 7, 
      max: 16, 
      condition: "sunny", 
      desc: "Despejado",
      precipitacion: 0,
      viento: 12,
      humedad: 58,
      uvIndex: 6,
      amanecer: '07:51',
      atardecer: '19:18'
    }
  ];

  // Datos por horas (próximas 24h)
  const datosPorHoras = [
    { time: '09:00', temp: 6, condition: 'partly-cloudy', precipitation: 0 },
    { time: '12:00', temp: 10, condition: 'sunny', precipitation: 0 },
    { time: '15:00', temp: 12, condition: 'partly-cloudy', precipitation: 10 },
    { time: '18:00', temp: 9, condition: 'cloudy', precipitation: 20 },
    { time: '21:00', temp: 6, condition: 'light-rain', precipitation: 40 },
    { time: '00:00', temp: 4, condition: 'cloudy', precipitation: 15 },
    { time: '03:00', temp: 2, condition: 'snow', precipitation: 60 },
    { time: '06:00', temp: 1, condition: 'snow', precipitation: 80 }
  ];

  // Estaciones por parroquia
  const estaciones = [
    { name: "Andorra la Vella", temp: 8, estado: "partly-cloudy", elevation: "1023m" },
    { name: "Encamp", temp: 5, estado: "snow", elevation: "1300m" },
    { name: "Ordino", temp: 3, estado: "heavy-snow", elevation: "1304m" },
    { name: "La Massana", temp: 6, estado: "cloudy", elevation: "1241m" },
    { name: "Escaldes-Engordany", temp: 9, estado: "partly-cloudy", elevation: "1105m" },
    { name: "Sant Julià de Lòria", temp: 10, estado: "sunny", elevation: "908m" }
  ];

  // Calidad del aire
  const calidadAire = {
    aqi: 42,
    nivel: "Buena",
    pm25: 8,
    pm10: 15,
    o3: 65,
    no2: 12,
    color: "text-green-600"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              {t('title')}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
              {t('description')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Actualizado: {currentTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          {/* Grid Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            {/* Clima Actual - Card Principal */}
            <div className="lg:col-span-8">
              <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-2xl"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-3xl font-bold">Andorra la Vella</h2>
                      <p className="text-blue-100 text-lg">Ahora mismo</p>
                    </div>
                    <WeatherIcon condition={climaActual.icon} size="w-20 h-20" />
                  </div>
                  
                  <div className="flex items-end space-x-6 mb-8">
                    <span className="text-7xl font-bold">{climaActual.temperatura}°C</span>
                    <div className="text-blue-100 pb-2">
                      <p className="text-lg">Sensación {climaActual.sensacion}°C</p>
                      <p className="text-base">{climaActual.condicion}</p>
                    </div>
                  </div>

                  {/* Métricas principales */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-2xl">💧</span>
                        <p className="text-blue-100 text-sm">Humedad</p>
                      </div>
                      <p className="font-bold text-xl">{climaActual.humedad}%</p>
                    </div>
                    
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-2xl">💨</span>
                        <p className="text-blue-100 text-sm">Viento</p>
                      </div>
                      <p className="font-bold text-xl">{climaActual.viento} km/h</p>
                      <p className="text-blue-100 text-xs">{climaActual.direccionViento}</p>
                    </div>
                    
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-2xl">🌡️</span>
                        <p className="text-blue-100 text-sm">Presión</p>
                      </div>
                      <p className="font-bold text-xl">{climaActual.presion}</p>
                      <p className="text-blue-100 text-xs">hPa</p>
                    </div>
                    
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-2xl">☀️</span>
                        <p className="text-blue-100 text-sm">UV Index</p>
                      </div>
                      <p className="font-bold text-xl">{climaActual.uvIndex}</p>
                      <p className="text-blue-100 text-xs">{climaActual.uvLevel}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Derecho */}
            <div className="lg:col-span-4 space-y-6">
              {/* Estaciones por Parroquia */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center">
                  🏔️ Por Parroquias
                </h3>
                <div className="space-y-3">
                  {estaciones.map((estacion, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-gray-50/80 dark:bg-gray-700/50 hover:bg-gray-100/80 dark:hover:bg-gray-600/50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <WeatherIcon condition={estacion.estado} size="w-8 h-8" />
                        <div>
                          <span className="font-medium text-gray-800 dark:text-white text-sm">
                            {estacion.name}
                          </span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {estacion.elevation}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-lg text-gray-800 dark:text-white">
                        {estacion.temp}°C
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Calidad del Aire */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center">
                  🌬️ Calidad del Aire
                </h3>
                <div className="text-center mb-4">
                  <div className={`text-4xl font-bold ${calidadAire.color} mb-2`}>
                    {calidadAire.aqi}
                  </div>
                  <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    {calidadAire.nivel}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50/80 dark:bg-gray-700/50 rounded-lg p-3">
                    <p className="text-gray-600 dark:text-gray-400">PM2.5</p>
                    <p className="font-bold text-gray-800 dark:text-white">{calidadAire.pm25} μg/m³</p>
                  </div>
                  <div className="bg-gray-50/80 dark:bg-gray-700/50 rounded-lg p-3">
                    <p className="text-gray-600 dark:text-gray-400">PM10</p>
                    <p className="font-bold text-gray-800 dark:text-white">{calidadAire.pm10} μg/m³</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Previsión por Partes del Día - HOY */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl mb-8">
            <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white flex items-center">
              🌅 Previsión de Hoy
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {previsionHoy.map((periodo, index) => (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 shadow-md">
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{periodo.periodo}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{periodo.hora}</p>
                    
                    <div className="flex justify-center mb-4">
                      <WeatherIcon condition={periodo.condition} size="w-16 h-16" />
                    </div>
                    
                    <div className="flex justify-center items-center space-x-2 mb-4">
                      <span className="text-2xl font-bold text-gray-800 dark:text-white">{periodo.temp.max}°</span>
                      <span className="text-lg text-gray-500 dark:text-gray-400">{periodo.temp.min}°</span>
                    </div>
                    
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{periodo.desc}</p>
                    
                    <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex justify-between">
                        <span>💧 Precipitación:</span>
                        <span>{periodo.precipitacion}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>💨 Viento:</span>
                        <span>{periodo.viento} km/h</span>
                      </div>
                      <div className="flex justify-between">
                        <span>💧 Humedad:</span>
                        <span>{periodo.humedad}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pronóstico por Horas */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl mb-8">
            <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white flex items-center">
              📊 Próximas 24 Horas
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {datosPorHoras.map((hora, index) => (
                <div key={index} className="text-center p-3 rounded-xl bg-gray-50/80 dark:bg-gray-700/50">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{hora.time}</p>
                  <WeatherIcon condition={hora.condition} size="w-8 h-8" />
                  <p className="font-semibold text-sm text-gray-800 dark:text-white mt-2">{hora.temp}°</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">{hora.precipitation}%</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pronóstico Extendido 7 días */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl mb-8">
            <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white flex items-center">
              📅 Pronóstico 7 Días
            </h3>
            <div className="space-y-3">
              {pronostico7Dias.map((dia, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-gray-50/80 dark:bg-gray-700/50 hover:bg-gray-100/80 dark:hover:bg-gray-600/50 transition-colors">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-20 text-center">
                      <p className="font-semibold text-gray-800 dark:text-white">{dia.dia}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{dia.fecha}</p>
                    </div>
                    <WeatherIcon condition={dia.condition} size="w-12 h-12" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 dark:text-white">{dia.desc}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-400 mt-1">
                        <span>💧 {dia.precipitacion}%</span>
                        <span>💨 {dia.viento} km/h</span>
                        <span>💧 {dia.humedad}%</span>
                        <span>☀️ UV {dia.uvIndex}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-400 mt-1">
                        <span>🌅 {dia.amanecer}</span>
                        <span>🌇 {dia.atardecer}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-lg text-gray-800 dark:text-white">{dia.max}°</span>
                      <span className="text-gray-500 dark:text-gray-400">{dia.min}°</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grid Inferior - Información Adicional */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Avisos Meteorológicos */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center">
                ⚠️ Avisos Meteorológicos
              </h3>
              <div className="space-y-3">
                <div className="bg-yellow-200/80 dark:bg-yellow-800/50 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                    <p className="font-semibold text-gray-800 dark:text-white">Aviso Amarillo - Nieve</p>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Posibles nevadas por encima de 1500m. Acumulación esperada: 10-20cm
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    Válido hasta: 27 Sep, 18:00
                  </p>
                </div>
              </div>
            </div>

            {/* Condiciones de Montaña */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center">
                🏔️ Condiciones de Montaña
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-gray-700/30 rounded-xl">
                  <div>
                    <span className="font-medium text-gray-800 dark:text-white">Grandvalira</span>
                    <p className="text-xs text-gray-600 dark:text-gray-400">2100m</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-800 dark:text-white">-5°C</span>
                    <p className="text-xs">❄️ Nieve</p>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-gray-700/30 rounded-xl">
                  <div>
                    <span className="font-medium text-gray-800 dark:text-white">Soldeu</span>
                    <p className="text-xs text-gray-600 dark:text-gray-400">1800m</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-800 dark:text-white">-2°C</span>
                    <p className="text-xs">🌨️ Nevando</p>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-gray-700/30 rounded-xl">
                  <div>
                    <span className="font-medium text-gray-800 dark:text-white">Pal Arinsal</span>
                    <p className="text-xs text-gray-600 dark:text-gray-400">1650m</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-800 dark:text-white">0°C</span>
                    <p className="text-xs">☁️ Nublado</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enlaces Oficiales */}
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold mb-6 text-center text-gray-800 dark:text-white">
              Fuentes Meteorológicas Oficiales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a href="https://www.meteo.ad" target="_blank" rel="noopener noreferrer" 
                 className="group p-4 bg-white/80 dark:bg-gray-700/50 rounded-xl hover:bg-white dark:hover:bg-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                <div className="text-center">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🌤️</div>
                  <h4 className="font-semibold text-gray-800 dark:text-white">Servei Meteorològic</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Datos oficiales Andorra</p>
                </div>
              </a>
              <a href="https://www.grandvalira.com/invierno/webcams-meteo" target="_blank" rel="noopener noreferrer" 
                 className="group p-4 bg-white/80 dark:bg-gray-700/50 rounded-xl hover:bg-white dark:hover:bg-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                <div className="text-center">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🎿</div>
                  <h4 className="font-semibold text-gray-800 dark:text-white">Estado Pistas</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Condiciones esquí</p>
                </div>
              </a>
              <a href="https://www.bombers.ad" target="_blank" rel="noopener noreferrer" 
                 className="group p-4 bg-white/80 dark:bg-gray-700/50 rounded-xl hover:bg-white dark:hover:bg-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                <div className="text-center">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🚨</div>
                  <h4 className="font-semibold text-gray-800 dark:text-white">Protección Civil</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Alertas y avisos</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
