import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Search,
  MessageSquare,
  Mail,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';
import { useGetFaqsQuery } from './hooks/useGetFaqsQuery';
import { FaqItem as FaqItemType } from './api/faq-api';

const FAQItem = ({
  item,
  expanded,
  onPress,
}: {
  item: FaqItemType;
  expanded: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.faqItem} onPress={onPress}>
    <View style={styles.faqHeader}>
      <Text style={styles.faqQuestion}>{item.question}</Text>
      {expanded ? (
        <ChevronUp size={20} color="#1A1A1A" />
      ) : (
        <ChevronDown size={20} color="#1A1A1A" />
      )}
    </View>
    {expanded && <Text style={styles.faqAnswer}>{item.answer}</Text>}
  </TouchableOpacity>
);

export const HelpCenter = ({ navigation }: any) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { data, isLoading } = useGetFaqsQuery();

  const faqs = data?.data?.items ?? [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pusat Bantuan</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.searchBar}>
          <Search size={20} color="#737373" />
          <TextInput placeholder="Cari nama, bank, nomor rekening" style={styles.searchInput} />
        </View>

        <View style={styles.contactCards}>
          <TouchableOpacity style={styles.contactCard}>
            <MessageSquare size={24} color="#4F84F6" />
            <Text style={styles.contactTitle}>Chat CS</Text>
            <Text style={styles.contactSub}>Online 24/7</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactCard}>
            <Mail size={24} color="#4F84F6" />
            <Text style={styles.contactTitle}>Email</Text>
            <Text style={styles.contactSub}>help@doitpay.co</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>PERTANYAAN UMUM</Text>

        {isLoading ? (
          <ActivityIndicator size="small" color="#4F84F6" style={styles.loader} />
        ) : (
          faqs.map((item) => (
            <FAQItem
              key={item.id}
              item={item}
              expanded={expandedId === item.id}
              onPress={() => setExpandedId(expandedId === item.id ? null : item.id)}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 16 },
  headerTitle: { fontFamily: 'Switzer-Semibold', fontSize: 22, color: '#1A1A1A' },
  content: { paddingHorizontal: 20 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  searchInput: { flex: 1, fontFamily: 'Switzer-Regular' },
  contactCards: { flexDirection: 'row', gap: 16, marginVertical: 24 },
  contactCard: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4F84F6',
  },
  contactTitle: { fontSize: 16, fontFamily: 'Switzer-Bold', color: '#1A1A1A', marginTop: 12 },
  contactSub: { fontSize: 12, fontFamily: 'Switzer-Regular', color: '#737373', marginTop: 4 },
  sectionTitle: { fontSize: 12, fontFamily: 'Switzer-Medium', color: '#1A1A1A', marginBottom: 16 },
  faqItem: { paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQuestion: { flex: 1, fontSize: 16, fontFamily: 'Switzer-Bold', color: '#1A1A1A' },
  faqAnswer: {
    fontSize: 14,
    fontFamily: 'Switzer-Regular',
    color: '#737373',
    marginTop: 12,
    lineHeight: 22,
  },
  loader: { marginTop: 24 },
});
