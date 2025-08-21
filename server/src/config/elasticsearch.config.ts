import { ElasticsearchModuleOptions } from '@nestjs/elasticsearch';
import { ConfigService } from '@nestjs/config';

export const getElasticsearchConfig = (configService: ConfigService): ElasticsearchModuleOptions => ({
  node: configService.get('ELASTICSEARCH_NODE', 'http://localhost:9200'),
  auth: {
    username: configService.get('ELASTICSEARCH_USERNAME', 'elastic'),
    password: configService.get('ELASTICSEARCH_PASSWORD', 'changeme'),
  },
  tls: {
    rejectUnauthorized: false,
  },
  maxRetries: 3,
  requestTimeout: 10000,
  pingTimeout: 3000,
  sniffOnStart: true,
});

export const elasticsearchConfig: ElasticsearchModuleOptions = {
  node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME || 'elastic',
    password: process.env.ELASTICSEARCH_PASSWORD || 'changeme',
  },
  tls: {
    rejectUnauthorized: false,
  },
  maxRetries: 3,
  requestTimeout: 10000,
  pingTimeout: 3000,
  sniffOnStart: true,
};
