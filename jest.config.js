/**
 * Jest Test Yapılandırması
 * Bu dosya, Jest test çerçevesinin nasıl çalışacağını yapılandırır.
 * ES Module desteği için gerekli ayarlar eklenmiştir.
 */
export default {
  // Node ortamında testleri çalıştır
  testEnvironment: 'node',
  // ES modules için gerekli
  transform: {},
  // moduleNameMapper ES modülleri için gerekli
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  // Test dosyaları için eşleşme deseni
  testMatch: ['**/__tests__/**/*.test.js'],
  // Ayrıntılı çıktı göster
  verbose: true,
  // Test kapsamı raporları oluştur
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  coveragePathIgnorePatterns: ['/node_modules/', '/__tests__/'],
  // Test zaman aşımı (milisaniye cinsinden)
  testTimeout: 30000
};
